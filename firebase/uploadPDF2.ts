import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  query,
  where,
  setDoc,
  getDocs,
  getFirestore,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import firebaseApp from "./client";

const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);

export default async function uploadAndMovePDF(pdf, fileName) {
  const storageRef = ref(storage, `expedientes/${fileName}`);
  let [prefix, num, year, ext] = fileName.replace(".pdf", "").split("-");

  if (!prefix || !num || !year || !ext) {
    console.log("Error en el nombre del archivo");
    return null;
  }

  console.log("Campos obtenidos del nombre del archivo:");
  console.log({ prefix, num, year, ext });

  try {
    let url = null;

    // Verificar si ya existe un archivo con el mismo nombre
    try {
      url = await getDownloadURL(storageRef);
      console.log("Ya existe un archivo con el mismo nombre:", `${prefix}-${num}-${year}-${ext}.pdf`);
      return null; // Salir de la función
    } catch (error) {
      console.log("El archivo no existe en el storage, se procederá a subirlo.");
    }

    console.log("Ruta de la colección objetivo:", `records/records_incomplete/${year}`);
    
    let expedientesCollectionRef = collection(db, `records/records_incomplete/${year}`);

    console.log("Ejecutando consulta en la colección de expedientes.");
    const expedientesQuery = query(
      expedientesCollectionRef,
      where("prefix", "==", parseInt(prefix, 10)),
      where("num", "==", parseInt(num, 10)),
      where("year", "==", parseInt(year, 10)),
      where("ext", "==", parseInt(ext, 10))
    );

    const expedientesSnapshot = await getDocs(expedientesQuery);

    if (!expedientesSnapshot.empty) {
      console.log("Expediente encontrado:", expedientesSnapshot.docs[0].id);

      try {
        await uploadBytes(storageRef, pdf);
        console.log("Archivo subido correctamente.");
        url = await getDownloadURL(storageRef);
        try {
          // Actualizar el campo "file" del documento encontrado
          const expedienteDoc = doc(db, `records/records_incomplete/${year}`, expedientesSnapshot.docs[0].id);
          await updateDoc(expedienteDoc, { file: url });
          console.log(`Expediente ${prefix}-${num}-${year}-${ext} actualizado con la URL del archivo.`);

          // Obtener datos del documento actualizado
          const expedienteData = expedientesSnapshot.docs[0].data();
          expedienteData.file = url;

          try {
            // Crear el nuevo documento en la colección completa
            const newDocRef = doc(db, `records/records_complete/${year}`, expedientesSnapshot.docs[0].id);
            await setDoc(newDocRef, expedienteData);
            console.log(`Expediente ${prefix}-${num}-${year}-${ext} movido a la colección completa.`);

            try {
              // Eliminar el documento de la colección incompleta
              await deleteDoc(expedienteDoc);
              console.log(`Expediente ${prefix}-${num}-${year}-${ext} eliminado de la colección incompleta.`);
            } catch (error) {
              console.error("Error al eliminar el documento de la colección incompleta:", error);
              throw error; // Re-lanzar el error si la eliminación falla
            }
          } catch (error) {
            console.error("Error al mover el documento a la colección completa:", error);
            throw error; // Re-lanzar el error para evitar la eliminación del documento original
          }
        } catch (error) {
          console.error("Error al actualizar el documento:", error);
          throw error; // Re-lanzar el error para manejarlo externamente si es necesario
        }
      } catch (error) {
        console.error("Error al subir el archivo PDF:", error);
        throw error; // Re-lanzar el error para manejarlo externamente si es necesario
      }

      return url;
    } else {
      console.log("No se encontró el expediente en la base de datos.");
      return null;
    }
  } catch (error) {
    console.error("Error al subir y mover el archivo PDF:", error);
    throw error;
  }
}
