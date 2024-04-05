import { getFirestore, doc, deleteDoc, getDoc } from "firebase/firestore";
import firebaseApp from "./client";

const db = getFirestore(firebaseApp);

export default async function deleteDocument(documentId) {
  const docRef = doc(db, "expedientes", documentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.log(`Documento ${documentId} no existe y no puede ser eliminado.`);
    return;
  }

  try {
    await deleteDoc(docRef);
    console.log(`Documento ${documentId} eliminado con éxito.`);
  } catch (error) {
    console.error(`Error al eliminar el documento ${documentId}: `, error);
  }
}
