import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  doc,
  updateDoc,
} from "firebase/firestore";
import firebaseApp from "./client";

const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);

export default async function uploadPDF(pdf, fileName) {
  const storageRef = ref(storage, `expedientes/${fileName}`);
  let [prefix, num, year, ext] = fileName.replace(".pdf", "").split("-");

  if (!prefix || !num || !year || !ext) {
    console.log("Error en el nombre del archivo");
    return null;
  }

  if (ext == "0") {
    ext = "MADRE";
  }
  console.log("campos");
  console.log([prefix, num, year, ext]);
  try {
    let url = null;
    // Verificar si ya existe un archivo con el mismo nombre
    try {
      url = await getDownloadURL(storageRef);
      console.log(
        "Ya existe un archivo con el mismo nombre.",
        `${prefix}-${num}-${year}-${ext}.pdf`
      );
      return null; // Salir de la función
    } catch (error) {
      // El archivo no existe, continuar con la subida
      console.log(
        "El archivo no existe en el storage, se procederá a subirlo."
      );
    }

    let expedientesCollectionRef = query(collection(db, "expedientes"));
    const expedientesQuery = query(
      expedientesCollectionRef,
      where("prefix", "==", prefix),
      where("num", "==", num),
      where("year", "==", year),
      where("ext", "==", ext)
    );
    const expedientesSnapshot = await getDocs(expedientesQuery);

    if (!expedientesSnapshot.empty) {
      await uploadBytes(storageRef, pdf);
      // Obtener la URL de descarga del archivo PDF
      url = await getDownloadURL(storageRef);

      // Hacer algo con la URL (por ejemplo, guardarla en la base de datos)
      // Actualizar el campo "file" del documento encontrado
      if (expedientesSnapshot.docs.length > 0) {
        const expedienteDoc = doc(
          db,
          "expedientes",
          expedientesSnapshot.docs[0].id
        );
        await updateDoc(expedienteDoc, { file: url });
        console.log(`Expediente: ${prefix}-${num}-${year}-${ext} actualizado`);
      }
      return url;
    }
    console.log("no existe el expediente en la base de datos");
    return null;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}
