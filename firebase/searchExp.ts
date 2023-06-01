import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import FieldsUpload from "../src/interfaces/fieldsUpload";
import firebaseApp from "./client";
import _ from "lodash";

interface Expediente {
  starter: string;
  prefijo: string;
  num: string;
  year: string;
  extension: string;
}

const db = getFirestore(firebaseApp);

export default async function searchExp (fieldsSearch) {
  const { starter, prefijo, num, year, extension }: FieldsUpload = fieldsSearch;
  let expedientesArray = [];

  if (starter) {
    expedientesArray = _.concat(
      expedientesArray,
      await getData("expedientes", "starter", starter, "==")
    );
  }

  if (num) {
    expedientesArray = _.concat(
      expedientesArray,
      await getData("expedientes", "num", num, "==")
    );
  }

  if (year) {
    expedientesArray = _.concat(
      expedientesArray,
      await getData("expedientes", "year", year, "==")
    );
  }

  if (extension) {
    expedientesArray = _.concat(
      expedientesArray,
      await getData("expedientes", "extension", extension, "==")
    );
  }

  return await _.uniqWith(expedientesArray, _.isEqual);
}


//hace una busqueda con wheres or (muy costosa)
const getData = async (
  col: string,
  field: string,
  value: string,
  operator: WhereFilterOp
) => {
  const response = [];
  const q = query(collection(db, col), where(field, operator, value));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    const o = doc.data();
    o["id"] = doc.id;
    response.push(o);
  });

  return response;
};



//hace una busqueda con wheres and
 async function findWhere (fieldsSearch) {
  console.log({ fieldsSearch });
  const { starter, prefijo, num, year, extension }: FieldsUpload = fieldsSearch;
  const expedientes = [];

  const q = query(
    collection(db, "expedientes"),
    fieldsSearch.starter ? where("starter", "==", starter) : null,
    where("prefijo", "==", prefijo),
    where("num", "==", num),
    where("year", "==", year),
    where("extension", "==", extension),
    
  );
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    expedientes.push(doc.data());
  });
  console.log({ expedientes });
  return expedientes;
}