import {
  getFirestore,
  collection,
  setDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import firebaseApp from "./client";
import FieldsUpload from "../src/interfaces/fieldsUpload";

const db = getFirestore(firebaseApp);

function normalizeData(data) {
  data.year = parseInt(data.year, 10) || 0;
  data.num = parseInt(data.num, 10) || 0;
  data.prefix = parseInt(data.prefix, 10) || 0;
  data.starterNum = parseInt(data.starterNum, 10) || 0;

  const madre = data.ext === "madre" || data.ext === "MADRE";
  data.ext = madre ? 0 : parseInt(data.ext, 10);

  return data;
}

// This function receives the data and uploads it to the collection records/records_incomplete/year
// It is used for bulk CSV uploads
export default async function uploadData(data: FieldsUpload) {
  data = normalizeData(data);

  // Check if a record with the same num already exists
  const recordsRef = collection(db, `records/records_incomplete/${data.year}`);
  const q = query(recordsRef, where("num", "==", data.num));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    console.log("A record with the same num already exists:", data.num);
    return;
  }

  let documentId = doc(recordsRef).id;
  let ref = doc(db, `records/records_incomplete/${data.year}`, documentId);

  try {
    await setDoc(ref, data);
    console.log("Creando documento del año:", data.year);
  } catch (error) {
    console.log("Error al crear documento en Firebase");
    console.log(error);
  }
}