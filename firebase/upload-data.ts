



  import {
    getFirestore,
    collection,
    setDoc,
    query,
    doc,
    addDoc,
  } from "firebase/firestore";
  import firebaseApp from "./client";
import FieldsUpload from "../src/interfaces/fieldsUpload";
  
  
  const db = getFirestore(firebaseApp);
  
  export default async function uploadData(data: FieldsUpload) {
    let documentId = doc(collection(db, "expedientes")).id;
    let ref = doc(db, "expedientes", documentId);
    try {
      await setDoc(ref, data);
    } catch (error) {
      console.log("error al crear documento firebase")
      console.log(error)
    }

  }
  