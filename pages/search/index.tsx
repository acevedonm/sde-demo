import { Container, MenuItem, Tooltip } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FilesService } from "../../utils/files.service";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { getAllExp, getExpedientesPorPagina } from "../../firebase/getAllExp";
import LinearProgress from "@mui/material/LinearProgress";
import searchExp from "../../firebase/searchExp";
import { Records } from "../../src/interfaces/records";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import DynamicTable from "../../components/DynamicTable";

const storage = getStorage();

function download(data: Records) {
  //NOTA: Aca estas armando la url de descarga con los campos del documento, cuando en realidad en doc.file esta la url, fijate
  //que vuelta le podemos dar a esto ?
  getDownloadURL(
    ref(
      storage,
      `expedientes/${data.prefix}-${data.num}-${data.year}-${data.ext}.pdf`,
    ),
  )
    .then((url) => {
      FilesService.downloadFile(url, "name");
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open("GET", url);
      xhr.send();
    })
    .catch((error) => {
      console.log({ error });
    });
}

export default function Search() {
  const [encontrado, setEncontrado] = useState(false);
  const [fieldsSearch, setFieldsSearch] = useState({
    starter: "",
    prefijo: 4069,
    num: "",
    year: new Date().getFullYear(),
    ext: "",
    extract: "",
  });
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(false);
  const [rows, setRows] = useState([]);

  let staticHeaders = [
    "prefix",
    "num",
    "year",
    "extract",
    "ext",
    "starter",
    "starterNum",
    "starterLocation",
    "starterCp",
    "type",
    "date",
    "status",
  ];

  function IconAlerts() {
    return (
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert
          severity="error"
          onClose={() => {
            setAlert(false);
          }}
        >
          <AlertTitle>Error</AlertTitle>
          No se encontraron expedientes —{" "}
          <strong> Revise los campos de busqueda</strong>
        </Alert>
      </Stack>
    );
  }

  const verTodos = async () => {
    //seteo nuevas rows setRows
    setAlert(false);
    setLoading(true);
    //cambiar el siguiente false por un true para que filtre solo los que tienen pdf
    const newData = await getExpedientesPorPagina(0, 10, true);
    setLoading(false);
    setRows(newData);

    setEncontrado(true);
  };

  const buscar = async () => {
    setLoading(true);
    const newData = await searchExp(fieldsSearch);

    setRows(newData);

    setEncontrado(true);
    setLoading(false);
    if (newData.length == 0) {
      setAlert(true);
    } else {
      setAlert(false);
    }
  };

  const changeSeachStarter = (event) => {
    setFieldsSearch({
      ...fieldsSearch,
      starter: event.target.value,
    });
  };

  const changeSeachNum = (event) => {
    setFieldsSearch({
      ...fieldsSearch,
      num: event.target.value,
    });
  };
  const changeSeachYear = (event) => {
    setFieldsSearch({
      ...fieldsSearch,
      year: event.target.value,
    });
  };
  const changeSeachExtract = (event) => {
    setFieldsSearch({
      ...fieldsSearch,
      extract: event.target.value,
    });
  };

  return (
    <>
      {alert ? <IconAlerts></IconAlerts> : <></>}
      <Container>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              disabled
              id="prefijo"
              label="Prefijo"
              defaultValue="4069"
              type="search"
            />
            <TextField
              id="num"
              label="N°"
              type="search"
              onChange={changeSeachNum}
            />

            <TextField
              id="year"
              label="Año"
              select
              value={fieldsSearch.year}
              onChange={changeSeachYear}
              helperText="Seleccione un año"
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 200, // Ajusta la altura máxima del menú desplegable
                    },
                  },
                },
              }}
            >
              {Array.from(
                { length: 2025 - 2000 },
                (_, index) => 2000 + index,
              ).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="extract"
              label="Extracto"
              type="search"
              onChange={changeSeachExtract}
            />
          </div>
          <Button
            variant="contained"
            onClick={buscar}
            style={{ marginRight: "10px" }}
          >
            Buscar
          </Button>
        </Box>
        {loading && (
          <Box sx={{ marginTop: "15vh", width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
        {encontrado && !loading ? (
          <DynamicTable
            data={rows}
            headers={staticHeaders}
            currentPage={0}
            onPageChange={() => console.log("page change")}
            buttonAction={download}
          ></DynamicTable>
        ) : null}
      </Container>
    </>
  );
}
