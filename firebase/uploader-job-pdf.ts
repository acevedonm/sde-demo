import admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

function uploadMassivePDF() {
  const db = admin.firestore();

  // Ruta de la carpeta que contiene los archivos PDF
  const carpetaPDF = "/ruta/a/la/carpeta";

  // Función para subir un archivo PDF a Firebase
  async function subirPDF(rutaArchivo: string) {
    try {
      const archivo = path.parse(rutaArchivo);
      const nombreArchivo = archivo.base;

      // Leer el archivo PDF
      const contenido = fs.readFileSync(rutaArchivo);

      // Subir el archivo a Firebase Storage
      const archivoRef = admin.storage().bucket().file(nombreArchivo);
      await archivoRef.save(contenido);

      // Obtener la URL de descarga del archivo
      const urlDescarga = await archivoRef.getSignedUrl({
        action: "read",
        expires: "03-01-2500", // Cambia esto según tus necesidades
      });

      // Guardar la URL de descarga en la base de datos Firebase
      await db.collection("archivos").doc(nombreArchivo).set({
        nombre: nombreArchivo,
        urlDescarga: urlDescarga[0],
      });

      console.log(
        `Archivo ${nombreArchivo} subido y guardado en la base de datos.`,
      );
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    }
  }

  // Función para recorrer la carpeta y subir los archivos PDF
  function recorrerCarpeta(carpeta: string) {
    fs.readdir(carpeta, (error, archivos) => {
      if (error) {
        console.error("Error al leer la carpeta:", error);
        return;
      }

      archivos.forEach((archivo) => {
        const rutaArchivo = path.join(carpeta, archivo);
        const estadisticasArchivo = fs.statSync(rutaArchivo);

        if (estadisticasArchivo.isFile() && archivo.endsWith(".pdf")) {
          subirPDF(rutaArchivo);
        }
      });
    });
  }

  // Llamar a la función para recorrer la carpeta y subir los archivos
  recorrerCarpeta(carpetaPDF);
}

export default uploadMassivePDF;
