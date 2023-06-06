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
  const expedientes = [];

  let conditionalStarter: QueryConstraint = starter 
? where("starter", "==", starter) 
: null

let conditionalYear: QueryConstraint = year 
? where("year", "==", year) 
: null

let conditionalNum: QueryConstraint = num 
? where("num", "==", num) 
: null

let conditionalExtension: QueryConstraint = extension 
? where("extension", "==", extension) 
: null

  const qb = query(
    collection(db, "expedientes"),conditionalStarter,conditionalYear,conditionalNum,conditionalExtension
  );

  const snapshot = await getDocs(qb);
  snapshot.forEach((doc) => {
    expedientes.push(doc.data());
  });
  return expedientes;
}