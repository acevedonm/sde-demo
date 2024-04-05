import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "./client";
import algoliasearch from "algoliasearch";

const db = getFirestore(firebaseApp);

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
);

export default async function synchronizeFirestoreToAlgolia(year) {
  if (!year) {
    console.log("No se encontro año para sincronizar");
    return null;
  }
  const recordsCollection = `${process.env.NEXT_PUBLIC_FIREBASE_COLLECTION_RECORDS}/${year}`;
  const algoliaIndex = algoliaClient.initIndex(
    `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX}_${year}`,
  );

  const querySnapshot = await getDocs(collection(db, recordsCollection));
  const records = [];

  querySnapshot.forEach((doc) => {
    const record = {
      objectID: doc.id,
      extract: doc.data().extract,
      num: doc.data().num,
      starter: doc.data().starter,
    };
    records.push(record);
  });

  algoliaIndex
    .saveObjects(records)
    .then(() => {
      console.log(`Sincronizados ${records.length} registros con Algolia.`);
    })
    .catch((error) => {
      console.error("Error al sincronizar con Algolia:", error);
    });
}
