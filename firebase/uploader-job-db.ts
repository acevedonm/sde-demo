import {
    collection,
    getDocs,
    query,
  } from "firebase/firestore";
  import {
    getStorage , ref, uploadBytes
  } from "firebase/storage";
  import firebaseApp from "./client";
  import Papa from "papaparse";
import uploadData from "./upload-data";

  interface Expediente {
    starter: string;
    prefijo: string;
    num: string;
    year: string;
    extension: string;
  }
  
  const storage = getStorage(firebaseApp);
  
  export default async function uploaderJob (event) {

    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          console.log("cargando DB... ")
          console.log("Subiendo datos de expediente: ",d)
          uploadData(d)
          console.log({d})
          console.log("Expediente subido correctamente")
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });
      },
    });


  }
  