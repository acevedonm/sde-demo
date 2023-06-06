import {
    collection,
    getDocs,
    query,
  } from "firebase/firestore";
  import {
    getStorage , ref, uploadBytes
  } from "firebase/storage";
  import firebaseApp from "./client";
  
  interface Expediente {
    starter: string;
    prefijo: string;
    num: string;
    year: string;
    extension: string;
  }
  
  const storage = getStorage(firebaseApp);


  export default async function uploadPDF(pdf, id) {
    const storageRef = ref(storage, `expedientes/${id}.pdf`);
  
    try {
      const snapshot = await uploadBytes(storageRef, pdf);
      // Si la carga del PDF es exitosa, no es necesario hacer nada más
    } catch (error) {
      // Si ocurre un error en la carga del PDF, arrojamos una excepción
      throw new Error("Error en la carga del PDF");
    }
  }