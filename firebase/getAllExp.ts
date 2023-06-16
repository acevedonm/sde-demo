import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
} from "firebase/firestore";
import firebaseApp from "./client";


const db = getFirestore(firebaseApp);

/* export default async function getAllExp () {
  const expedientes = [];
  const q = query(collection(db, "expedientes"),limit(10));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    let newExp = doc.data()
    newExp.id=doc.id
    expedientes.push(newExp);
  });

  return expedientes;
}
 */


export async function getAllExp () {
  return  getExpedientesPorPagina(0);
}


export async function getExpedientesPorPagina(pageNumber: number = 0, pageSize: number = 10) {
  const startAfterDocument = pageNumber > 1 ? (pageNumber - 1) * pageSize : null;

  console.log({startAfterDocument})
  let pageQuery = query(collection(db, "expedientes"), limit(pageSize));
  if (startAfterDocument) {
    const startAfterDocRef = await getDocumentReference(startAfterDocument);
    pageQuery = query(pageQuery, startAfter(startAfterDocRef));
  }

  const pageSnapshot = await getDocs(pageQuery);
  const pageDocuments = pageSnapshot.docs;

  return pageDocuments.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}


async function getDocumentReference(documentIndex) {
  const querySnapshot = await getDocs(query(collection(db, "expedientes")));
  const documents = querySnapshot.docs;

  if (documentIndex >= 0 && documentIndex < documents.length) {
    return documents[documentIndex];
  }

  return null;
}
