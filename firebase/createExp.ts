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

interface Expediente {
  starter: string;
  prefijo: string;
  num: string;
  year: string;
  extension: string;
}

const db = getFirestore(firebaseApp);

export default async function (fields: FieldsUpload) {
  let documentId = doc(collection(db, "expedientes")).id;

  let ref = doc(db, "expedientes", documentId);

  console.log({ fields });
  await setDoc(ref, fields);
}
