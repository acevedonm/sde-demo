import { Container } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FilesService } from "../../utils/files.service";
import IconButton from "@mui/material/IconButton";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { getAllExp, getExpedientesPorPagina } from "../../firebase/getAllExp";
import LinearProgress from "@mui/material/LinearProgress";
import searchExp from "../../firebase/searchExp";
import { Expedientes } from "../../src/interfaces/expedientes";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import DynamicTable from "../../components/DynamicTable";

const storage = getStorage();

function download(data: Expedientes) {
  let ext = data.ext;
  if (data.ext == "MADRE") {
    ext = "0";
  }
  getDownloadURL(
    ref(
      storage,
      `expedientes/${data.prefix}-${data.num}-${data.year}-${ext}.pdf`,
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
    prefijo: "4069",
    num: "",
    year: "",
    ext: "",
  });
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(false);
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);

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

    let head = [
      "prefix",
      "num",
      "year",
      "date",
      "ext",
      "starter",
      "extract",
      "status",
      "type",
    ];
    setHeaders(head);

    setEncontrado(true);
  };

  const buscar = async () => {
    //seteo nuevas rows setRows
    setLoading(true);
    const newData = await searchExp(fieldsSearch);

    setRows(newData);

    let head = [
      "prefix",
      "date",
      "starterNum",
      "num",
      "type",
      "ext",
      "starter",
      "year",
      "starterLocation",
      "starterCp",
      "extract",
      "starterStreet",
      "status",
      "code",
    ];
    setHeaders(head);

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
  const changeSeachExtension = (event) => {
    setFieldsSearch({
      ...fieldsSearch,
      ext: event.target.value,
    });
  };

  return (
    /*  Aca va el login */
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
              id="starter"
              label="Iniciador"
              type="search"
              onChange={changeSeachStarter}
            />
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
              type="search"
              onChange={changeSeachYear}
            />
            {/*             <TextField
              id="extension"
              label="Extracto"
              type="search"
              onChange={changeSeachExtension}
            /> */}
          </div>
          <Button
            variant="contained"
            onClick={buscar}
            style={{ marginRight: "10px" }}
          >
            Buscar
          </Button>
          <Button color="primary" variant="contained" onClick={verTodos}>
            Ver Todos
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
            headers={headers}
            currentPage={0}
            onPageChange={() => console.log("page change")}
            buttonAction={download}
          ></DynamicTable>
        ) : null}
      </Container>
    </>
  );
}
