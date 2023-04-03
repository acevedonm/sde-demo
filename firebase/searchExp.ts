import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
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

export default async function (fieldsSearch) {
  console.log({ fieldsSearch });
  const { starter, prefijo, num, year, extension }: FieldsUpload = fieldsSearch;
  const expedientes = [];

  const q = query(
    collection(db, "expedientes"),
    where("starter", "==", starter),
    where("prefijo", "==", prefijo),
    where("num", "==", num),
    where("year", "==", year),
    where("extension", "==", extension)
  );
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    expedientes.push(doc.data());
  });
  console.log({ expedientes });
  return expedientes;
}
