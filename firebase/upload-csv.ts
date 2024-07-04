import {
    getFirestore,
    collection,
    setDoc,
    doc,
  } from "firebase/firestore";
  import firebaseApp from "./client";
  import FieldsUpload from "../src/interfaces/fieldsUpload";
  
  const db = getFirestore(firebaseApp);

  function normalizeData(data) {
    data.year = parseInt(data.year, 10) || 0;

    data.num = parseInt(data.num, 10) || 0;

    data.prefix = parseInt(data.prefix, 10) || 0;

    data.starterNum = parseInt(data.starterNum, 10) || 0;

    const madre = data.ext === "madre" || data.ext === "MADRE";
    data.ext = madre ? 0 : parseInt(data.ext, 10);

    return data;
  }
  
  //esta funcion recibe los datos y los carga en la coleccion records/records_incomplete/year, es utilizada en la carga masiva de csv
  export default async function uploadData(data: FieldsUpload) {

    let documentId = doc(collection(db, `records/records_incomplete/${data.year}`)).id;
    let ref = doc(db, `records/records_incomplete/${data.year}`, documentId);
    
    try {
      data = normalizeData(data);
      await setDoc(ref, data);
      console.log("Creando documento del año: ", data.year);

    } catch (error) {
      console.log("error al crear documento firebase");
      console.log(error);
    }
  }