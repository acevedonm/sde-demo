import { getFirestore, collection, getDocs, doc, setDoc, query, where } from "firebase/firestore";
import firebaseApp from "./client";


const db = getFirestore(firebaseApp);
export default async function migrateDocuments(year) {

  console.log('Ejecutando Migracion para el año: ',year);

  const expedientesRef = collection(db, 'expedientes');
  const q = query(expedientesRef, where("year", "==", year));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.log(`No se encontraron documentos para el año ${year}.`);
    return;
  }

  for (const docSnapshot of snapshot.docs) {
    const data = docSnapshot.data();

    data.year = parseInt(data.year, 10) || 0;
   
    data.num = parseInt(data.num, 10) || 0;

    data.prefix = parseInt(data.prefix, 10) || 0;

    data.starterNum = parseInt(data.starterNum, 10) || 0;
    
    data.ext = data.ext === "madre" ? 0 : parseInt(data.ext, 10) || 0;

    let targetCollectionPath = `records/records_${data.file ? 'complete' : 'incomplete'}/${year}`;

    const targetRef = doc(db, targetCollectionPath, docSnapshot.id);

    console.log(`Procesando documento: ${docSnapshot.id}`);
    await setDoc(targetRef, data);
    console.log(`Documento Guardado: ${docSnapshot.id}`);
  }
 

  console.log('Migración completada');
}

