import { getFirestore, collection, setDoc, doc } from "firebase/firestore";
import FieldsUpload from "../src/interfaces/fieldsUpload";
import firebaseApp from "./client";
import uploadPDF from "./uploadPDF";

const db = getFirestore(firebaseApp);

export default async function createExp(fields: FieldsUpload, PDF) {
  try {
    let documentId = doc(collection(db, "expedientes")).id;
    let ref = doc(db, "expedientes", documentId);
    try {
      await uploadPDF(
        PDF,
        `${fields.prefix}-${fields.num}-${fields.year}-${fields.ext}.pdf`,
      );
    } catch {
      console.log(
        "error al intentar cargar pdf: ",
        `${fields.prefix}-${fields.num}-${fields.year}-${fields.ext}.pdf`,
      );
    }
    await setDoc(ref, fields);
  } catch (error) {
    console.log("Error en createExp:", error);
    throw error;
  }
}
