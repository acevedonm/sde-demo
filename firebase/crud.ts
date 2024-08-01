import firebaseApp from "./client";
import { doc, deleteDoc, updateDoc, setDoc, getFirestore, addDoc, collection } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export const handleDelete = async (rows, setRows, isComplete) => {
  if (rows.length === 0) return;

  try {
    await Promise.all(rows.map(async (row) => {
      const year = row.year;
      const collectionPath = isComplete
        ? `records/records_complete/${year}`
        : `records/records_incomplete/${year}`;
      const docRef = doc(db, collectionPath, row.id);
      await deleteDoc(docRef);
    }));

    setRows([]);
    console.log("Expedientes eliminados correctamente");
  } catch (error) {
    console.error("Error al eliminar los expedientes: ", error.message);
  }
};

export const handleModify = async (rows, setRows, modifyData, isComplete) => {
  if (rows.length === 0) return;

  const selectedRow = rows[0];
  const originalYear = selectedRow.year;
  const newYear = parseInt(modifyData.year, 10);
  const originalDocRef = doc(
    db,
    `records/${isComplete ? "records_complete" : "records_incomplete"}/${originalYear}/${selectedRow.id}`
  );

  const updatedData = {
    ...modifyData,
    num: parseInt(modifyData.num, 10),
    year: newYear,
    ext: parseInt(modifyData.ext, 10),
    starterNum: parseInt(modifyData.starterNum, 10),
    prefix: parseInt(modifyData.prefix, 10),
  };

  try {
    if (originalYear !== newYear) {
      const newDocRef = doc(
        db,
        `records/${isComplete ? "records_complete" : "records_incomplete"}/${newYear}/${selectedRow.id}`
      );
      await setDoc(newDocRef, updatedData);
      await deleteDoc(originalDocRef);
      console.log("Documento movido y modificado:", selectedRow.id);
    } else {
      await updateDoc(originalDocRef, updatedData);
      console.log("Documento modificado:", selectedRow.id);
    }
    setRows(rows.map(row => (row.id === selectedRow.id ? { ...row, ...updatedData } : row)));
  } catch (error) {
    console.error("Error al modificar el documento:", error.message);
  }
};

export const handleCreateNew = async (newData, isComplete) => {
  const year = parseInt(newData.year, 10);
  const collectionPath = isComplete
    ? `records/records_complete/${year}`
    : `records/records_incomplete/${year}`;

  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      ...newData,
      num: parseInt(newData.num, 10),
      year,
      ext: parseInt(newData.ext, 10),
      starterNum: parseInt(newData.starterNum, 10),
      prefix: parseInt(newData.prefix, 10),
    });
    console.log("Nuevo documento creado con ID: ", docRef.id);
  } catch (error) {
    console.error("Error al crear el nuevo documento: ", error.message);
  }
};



//poder seleccionar un elemento al buscar
//hacer algunos campos obligatorios
//