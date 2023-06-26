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
import PaginatedResponse from "../src/interfaces/paginatedResponse";
import { Expedientes } from "../src/interfaces/expedientes";


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


/**
* En la función getExpedientesPorPagina, recibes pageNumber como parámetro, que indica el número de página que deseas obtener. Luego, estableces pageSize para determinar la cantidad de documentos por página.
* La variable startAfterDocument se calcula para determinar qué documento debe ser utilizado como referencia con startAfter() en la consulta. Si pageNumber es mayor que 1, se calcula el índice del documento en la página anterior. Si pageNumber es 1, se establece en null porque no se necesita startAfter() para la primera página.
* Luego, se crea la consulta utilizando query() y limit() para obtener los documentos correspondientes a la página actual. Si startAfterDocument no es null, se obtiene la referencia al documento correspondiente utilizando la función getDocumentReference().
* Finalmente, se obtiene el QuerySnapshot utilizando getDocs(), se extraen los documentos en pageDocuments y se devuelve un arreglo de objetos que contienen el id del documento y los datos del mismo.
* La función getDocumentReference se utiliza para obtener la referencia al documento en base al índice proporcionado. Esto se logra obteniendo todos los documentos de la colección y seleccionando el documento en el índice específico. 
* @param {number} pageNumber - numero de paginas
*/
export async function getExpedientesPorPagina(pageNumber: number = 0, pageSize: number = 10) {
  const startAfterDocument = pageNumber > 1 ? (pageNumber - 1) * pageSize : null;

  console.log({ startAfterDocument });

  let pageQuery = query(collection(db, "expedientes"), limit(pageSize));

  if (startAfterDocument) {
    const startAfterDocRef = await getDocumentReference(startAfterDocument);
    pageQuery = query(pageQuery, startAfter(startAfterDocRef));
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



async function getDocumentReference(documentIndex) {
  const querySnapshot = await getDocs(query(collection(db, "expedientes")));
  const documents = querySnapshot.docs;

  if (documentIndex >= 0 && documentIndex < documents.length) {
    return documents[documentIndex];
  }

  return null;
}
