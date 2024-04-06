import { getStorage } from "firebase/storage";
import firebaseApp from "./client";
import Papa from "papaparse";
import uploadData from "./upload-data";

const storage = getStorage(firebaseApp);


//Esta funcion carga los datos de un csv en la base de datos
export default async function uploaderJob(file, setLoading) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const rowsArray = [];
      const valuesArray = [];
      let indexToUse;
      // Iterating data to get column name and their values
      results.data.map((d, index) => {
        indexToUse = index;
        console.log("cargando DB... ");
        console.log("Subiendo datos de expediente: ", d);
        d.file = "";
        uploadData(d);
        console.log({ d });
        rowsArray.push(Object.keys(d));
        valuesArray.push(Object.values(d));
      });

      console.log("registros guardados: " + indexToUse);
      setLoading(false);
    },
  });
}
