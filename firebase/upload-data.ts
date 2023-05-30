



  import {
    getFirestore,
    collection,
    setDoc,
    query,
    doc,
    addDoc,
  } from "firebase/firestore";
  import FieldsUpload from "../src/interfaces/fieldsUpload";
  import firebaseApp from "./client";
  import uploadPDF from "./uploadPDF";
  
  interface Expediente {
    starter: string;
    prefijo: string;
    num: string;
    year: string;
    extension: string;
  }
  
  const db = getFirestore(firebaseApp);
  
  export default async function uploadData(data) {
    let documentId = doc(collection(db, "expedientes")).id;
    let ref = doc(db, "expedientes", documentId);
    await setDoc(ref, data);
  }
  