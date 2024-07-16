import Papa from "papaparse";
import uploadData from "./upload-csv";

// Esta función carga los datos de un csv en la base de datos
export default async function uploaderJob(file, setLoading) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const dataByYear = {};

      // Organizar datos por año
      results.data.forEach((d) => {
        const year = d.año; // Asegúrate de reemplazar 'año' con el nombre real de la columna del año
        if (!dataByYear[year]) {
          dataByYear[year] = [];
        }
        dataByYear[year].push(d);
      });

      // Iterar sobre grupos por año y pasarlos a otra función
      Object.keys(dataByYear).forEach((year) => {
        console.log(`Procesando datos para el año ${year}`);
        const dataForYear = dataByYear[year];
        dataForYear.forEach((d, index) => {
          console.log("Subiendo datos de expediente: ", d);
          d.file = "";
          uploadData(d);
          console.log({ d });
        });
        console.log(`Registros guardados para el año ${year}: ${dataForYear.length}`);
      });

      setLoading(false);
    },
  });
}
