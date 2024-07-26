import { getFirestore, collection, doc, deleteDoc } from "firebase/firestore";

const db = getFirestore();

export const handleDelete = async (rows, setRows) => {
  if (rows.length > 0) {
    const selectedRow = rows[0];
    const year = selectedRow.year;

    try {
      const docRef = doc(db, `records/records_incomplete/${year}`, selectedRow.id);
      await deleteDoc(docRef);
      console.log("Documento eliminado con éxito", selectedRow.id);

      const updatedRows = rows.filter((row) => row.id !== selectedRow.id);
      setRows(updatedRows);
    } catch (error) {
      console.error("Error al eliminar el documento: ", error);
    }
  }
};

export const handleModify = (rows) => {
  if (rows.length > 0) {
    const selectedRow = rows[0];
    // Aquí puedes agregar la lógica para modificar el registro seleccionado
    console.log("Modificar", selectedRow);
  }
};
