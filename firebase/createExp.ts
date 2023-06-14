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
    let documentId = doc(collection(db, "expedientes_pruebav2")).id;
    let ref = doc(db, "expedientes_pruebav2", documentId);
    await uploadPDF(PDF, `${fields.prefix}-${fields.num}-${fields.year}`);
    await setDoc(ref, fields);
  } catch (error) {
    console.log("Error en createExp:", error);
    throw error;
  }
}