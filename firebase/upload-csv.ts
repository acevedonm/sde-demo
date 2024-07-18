import { getFirestore, collection, setDoc, doc, getDocs } from "firebase/firestore";
import firebaseApp from "./client";

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

export default async function uploadData(data) {
  console.log(`Procesando datos para el año ${data[0].year}`);

    for (let d of data) {
      try {
      console.log("Subiendo datos de expediente: ", d);
      d.file = "";
      d = normalizeData(d);

      // Get existing data for the given year (if not already cached)
      const existingData = await getYearDataFromFirestore(d.year);

      // Check for duplicates locally
      const duplicateFound = existingData.some((existing) => existing.num === d.num);

      if (duplicateFound) {
        console.log("A record with the same num already exists for year:", d.year);
        continue;
      }

      // If no duplicates found, upload the data
      const recordsRef = collection(db, `records/records_incomplete/${d.year}`);
      let documentId = doc(recordsRef).id;
      let ref = doc(db, `records/records_incomplete/${d.year}`, documentId);

      await setDoc(ref, d);
      console.log("Creando documento del año:", d.year);
  } catch (error) {
    console.log("Error al interactuar con Firebase");
    console.error(error);
  }}
}