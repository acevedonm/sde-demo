import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  QueryConstraint,
} from "firebase/firestore";
import FieldsUpload from "../src/interfaces/fieldsUpload";
import firebaseApp from "./client";
import _ from "lodash";


const db = getFirestore(firebaseApp);

export default async function searchExp (fieldsSearch) {
  return await findWhere(fieldsSearch)
}

 async function findWhere (fieldsSearch) {

  const { starter, num, year, extension }: FieldsUpload = fieldsSearch;

  if (!starter && !num && !year && !extension) {
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

    if (extension) {
    qb = query(qb, where("extension", "==", extension));
  }

  const snapshot = await getDocs(qb);
  snapshot.forEach((doc) => {
    expedientes.push(doc.data());
  });
  return expedientes;
}