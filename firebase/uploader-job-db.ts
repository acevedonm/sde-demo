import Papa from "papaparse";
import uploadData from "./upload-csv";

// Esta función carga los datos de un csv en la base de datos
export default async function uploaderJob(file, setLoading) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async function (results) {
      const dataByYear = {};

      // Organizar datos por año
      results.data.forEach((d) => {
        const year = d.year; // Asegúrate de reemplazar 'year' con el nombre real de la columna del año
        if (!dataByYear[year]) {
          dataByYear[year] = [];
        }
        dataByYear[year].push(d);
      });

      // Iterar sobre grupos por año y pasarlos a otra función
      for (const year of Object.keys(dataByYear)) {
        await uploadData(dataByYear[year]);
      }

      setLoading(false);
    },
  });
}
