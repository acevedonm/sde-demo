import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
} from "firebase/firestore";
import FieldsUpload from "../src/interfaces/fieldsUpload";
import firebaseApp from "./client";
import _ from "lodash";


const db = getFirestore(firebaseApp);

export default async function searchExp (fieldsSearch) {
  return await findWhere(fieldsSearch)
  //return await findWherePagination(fieldsSearch)
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

  let actives = true
  if (actives) {
    qb = query(qb, where("file", "!=", ""));
  }
  const snapshot = await getDocs(qb);
  snapshot.forEach((doc) => {
    expedientes.push(doc.data());
  });
  return expedientes;
}



//-------------------------------------------- EJEMPLO DE PAGINACION

async function getDocumentReference(documentIndex) {
  const querySnapshot = await getDocs(query(collection(db, "expedientes")));
  const documents = querySnapshot.docs;

  if (documentIndex >= 0 && documentIndex < documents.length) {
    return documents[documentIndex];
  }

  return null;
}


export async function findWherePagination(fieldsSearch, pageNumber: number = 0, pageSize: number = 10,  actives: boolean = false ) {

  const startAfterDocument = pageNumber > 1 ? (pageNumber - 1) * pageSize : null;

  let pageQuery = query(collection(db, "expedientes"), limit(pageSize));

  if (startAfterDocument) {
    const startAfterDocRef = await getDocumentReference(startAfterDocument);
    pageQuery = query(pageQuery, startAfter(startAfterDocRef));
  }

  if (actives) {
    pageQuery = query(pageQuery, where("file", "!=", ""));
  }

  const { starter, num, year, ext }: FieldsUpload = fieldsSearch;

  if (!starter && !num && !year && !ext) {
    return [];
  }


  if (starter) {
    pageQuery = query(pageQuery, where("starter", "==", starter));
  }

  if (num) {
    pageQuery = query(pageQuery, where("num", "==", num));
  }

  if (year) {
    pageQuery = query(pageQuery, where("year", "==", year));
  }

    if (ext) {
      pageQuery = query(pageQuery, where("ext", "==", ext));
  }


  const pageSnapshot = await getDocs(pageQuery);
  const pageDocuments = pageSnapshot.docs;

  const totalResults = pageSnapshot.size;
  const totalPages = Math.ceil(totalResults / pageSize);

  const expedientes = pageDocuments.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));


  return expedientes;
}