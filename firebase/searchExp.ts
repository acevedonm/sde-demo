import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import FieldsUpload from "../src/interfaces/fieldsUpload";
import firebaseApp from "./client";
import _ from "lodash";


const db = getFirestore(firebaseApp);

export default async function searchExp (fieldsSearch) {
  return await findWhere(fieldsSearch)
}

 async function findWhere (fieldsSearch) {

  const { starter, num, year, ext }: FieldsUpload = fieldsSearch;

  if (!starter && !num && !year && !ext) {
    return [];
  }
  let qb = query(
    collection(db, "expedientes")
  );
  const expedientes = [];

  if (starter) {
    qb = query(qb, where("starter", "==", starter));
  }

  if (num) {
    qb = query(qb, where("num", "==", num));
  }

  if (year) {
    qb = query(qb, where("year", "==", year));
  }

    if (ext) {
    qb = query(qb, where("ext", "==", ext));
  }

  const snapshot = await getDocs(qb);
  snapshot.forEach((doc) => {
    expedientes.push(doc.data());
  });
  return expedientes;
}