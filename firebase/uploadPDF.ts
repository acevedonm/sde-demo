import {
    collection,
    getDocs,
    query,
  } from "firebase/firestore";
  import {
    getStorage , ref, uploadBytes
  } from "firebase/storage";
  import firebaseApp from "./client";

  
  const storage = getStorage(firebaseApp);


  export default async function uploadPDF(pdf, path) {
    const storageRef = ref(storage, `expedientes/${path}.pdf`);
  
    try {
      const snapshot = await uploadBytes(storageRef, pdf);
      // Si la carga del PDF es exitosa, no es necesario hacer nada más
    } catch (error) {
      // Si ocurre un error en la carga del PDF, arrojamos una excepción
      console.log({ error });
      throw error
    }
  }