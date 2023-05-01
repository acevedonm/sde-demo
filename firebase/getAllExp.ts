import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import firebaseApp from "./client";

interface Expediente {
  starter: string;
  prefijo: string;
  num: string;
  year: string;
  extension: string;
}

const db = getFirestore(firebaseApp);

export default async function getAllExp () {
  const expedientes = [];
  const q = query(collection(db, "expedientes"));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    expedientes.push(doc.data());
  });

  return expedientes;
}
