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


const db = getFirestore(firebaseApp);

export default async function createExp(fields: FieldsUpload,PDF) {

  try {
    if(!fields.num) throw new Error()
    let documentId = doc(collection(db, "expedientes")).id;
    let ref = doc(db, "expedientes", documentId);
    uploadPDF(PDF,documentId)
    await setDoc(ref, fields);
   
  } catch (error) {
    console.log("error en createExp: ", error)
    return error
  }
 
}
