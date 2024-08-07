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
import _ from "lodash";
import FieldsSearch from "../src/interfaces/fieldsSearch";
import algoliaClient from "../algolia/client";
import { Records } from "../src/interfaces/records";

const db = getFirestore(firebaseApp);

export default async function searchExp(fieldsSearch, isComplete = false) {
  return await findWherePagination(fieldsSearch, 0, 30, isComplete);
}

async function getDocumentReference(documentIndex, recordsCollection) {
  const querySnapshot = await getDocs(query(collection(db, recordsCollection)));
  const documents = querySnapshot.docs;

  if (documentIndex >= 0 && documentIndex < documents.length) {
    return documents[documentIndex];
  }

  return null;
}

export async function findWherePagination(
  fieldsSearch: FieldsSearch,
  pageNumber: number = 0,
  pageSize: number = 10,
  isComplete: boolean = false,
) {
  const { num, year, ext }: FieldsSearch = fieldsSearch;

  if (!year) {
    console.log("El campo año es obligatorio");
    return [];
  }
  if (!num && !year && !ext) {
    console.log("Faltan campos de busqueda");
    return [];
  }
 
  if (fieldsSearch.extract) {
    return await findWithExtract(fieldsSearch, pageNumber, pageSize);
  }

  const startAfterDocument =
    pageNumber > 1 ? (pageNumber - 1) * pageSize : null;

    const recordsCollection = isComplete
    ? `${process.env.NEXT_PUBLIC_FIREBASE_COLLECTION_RECORDS}/${fieldsSearch.year}`
    : `${process.env.NEXT_PUBLIC_FIREBASE_COLLECTION_RECORDS_INCOMPLETE}/${fieldsSearch.year}`

  let pageQuery = query(collection(db, recordsCollection), limit(pageSize));

  if (startAfterDocument) {
    const startAfterDocRef = await getDocumentReference(
      startAfterDocument,
      recordsCollection,
    );
    pageQuery = query(pageQuery, startAfter(startAfterDocRef));
  }

  if (num) {
    pageQuery = query(pageQuery, where("num", "==", Number(num)));
  }

  if (ext) {
    pageQuery = query(pageQuery, where("ext", "==", Number(ext)));
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

export async function findWithExtract(
  fieldsSearch: FieldsSearch,
  pageNumber: number = 0,
  pageSize: number = 10,
) {
  const recordsCollection = `${process.env.NEXT_PUBLIC_FIREBASE_COLLECTION_RECORDS}/${fieldsSearch.year}`;

  let firebaseQuery = query(collection(db, recordsCollection));
  let documentNums = [];

  if (fieldsSearch.extract) {
    const index = algoliaClient.initIndex(
      `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX}`,
    );

    try {
      const algoliaResults = await index.search(fieldsSearch.extract, {
        hitsPerPage: pageSize,
        page: pageNumber,
        filters: `year:${fieldsSearch.year}`,
      });

      documentNums = algoliaResults.hits.map((hit) => hit["num"]);

      const batchRecordsSize = 10;
      const numBatch = [];

      for (let i = 0; i < documentNums.length; i += batchRecordsSize) {
        numBatch.push(documentNums.slice(i, i + batchRecordsSize));
      }

      let responseExpedientes = [];

      for (const nums of numBatch) {
        const batchQuery = query(firebaseQuery, where("num", "in", nums));

        const querySnapshot = await getDocs(batchQuery);
        const expedientes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        responseExpedientes = responseExpedientes.concat(expedientes);
      }

      if (fieldsSearch.num) {
        return responseExpedientes.filter(
          (exp: Records) => exp.num == fieldsSearch.num,
        );
      }

      return responseExpedientes;
    } catch (error) {
      console.error("Error searching in Algolia:", error);
      return [];
    }
  }
}
