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

// Variable para almacenar los datos cargados por año
let cachedYearData = {};

function normalizeData(data) {
  data.year = parseInt(data.year, 10) || 0;
  data.num = parseInt(data.num, 10) || 0;
  data.prefix = parseInt(data.prefix, 10) || 0;
  data.starterNum = parseInt(data.starterNum, 10) || 0;

  const madre = data.ext === "madre" || data.ext === "MADRE";
  data.ext = madre ? 0 : parseInt(data.ext, 10);

  return data;
}

// Función para obtener los datos de un año específico si no están en caché
async function getYearDataFromFirestore(year) {
  if (!cachedYearData[year]) {
    const recordsRef = collection(db, `records/records_incomplete/${year}`);
    const querySnapshot = await getDocs(recordsRef);
    cachedYearData[year] = querySnapshot.docs.map((doc) => doc.data());
  }
  return cachedYearData[year];
}

// This function receives the data and uploads it to the collection records/records_incomplete/year
// It is used for bulk CSV uploads
export default async function uploadData(data: FieldsUpload) {
  data = normalizeData(data);

  try {
    // Get existing data for the given year (if not already cached)
    const existingData = await getYearDataFromFirestore(data.year);

    // Check for duplicates locally
    const duplicateFound = existingData.some((existing) => existing.num === data.num);

    if (duplicateFound) {
      console.log("A record with the same num already exists for year:", data.year);
      return;
    }

    // If no duplicates found, upload the data
    const recordsRef = collection(db, `records/records_incomplete/${data.year}`);
    let documentId = doc(recordsRef).id;
    let ref = doc(db, `records/records_incomplete/${data.year}`, documentId);

    await setDoc(ref, data);
    console.log("Creando documento del año:", data.year);
  } catch (error) {
    console.log("Error al interactuar con Firebase");
    console.error(error);
  }
}
