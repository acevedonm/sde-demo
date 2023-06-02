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
import getAllExp from "../../firebase/getAllExp";
import LinearProgress from "@mui/material/LinearProgress";
import searchExp from "../../firebase/searchExp";
import { Expedientes } from "../../src/interfaces/expedientes";
import { getStorage, ref, getDownloadURL } from "firebase/storage";


const storage = getStorage();




function download(data: Expedientes) {


  console.log({data})
  const gsReference = ref(storage, 'gs://bucket/images/stars.jpg');

  //dewTM0VZee0qjwnLBEgX.
  //${data.id}

  getDownloadURL(ref(storage, `expedientes/${data.id}.pdf`))
  .then((url) => {
    FilesService.downloadFile(url, "name"
    );
    console.log({url})
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      const blob = xhr.response;
    };
    xhr.open('GET', url);
    xhr.send();
    const img = document.getElementById('myimg');
    img.setAttribute('src', url);
  })
  .catch((error) => {
   console.log({error})
  });


}

export default function Search() {
  const [encontrado, setEncontrado] = useState(false);
  const [fieldsSearch, setFieldsSearch] = useState({
    starter: "",
    prefijo: "4069",
    num: "",
    year: "",
    extension: "",
  });
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(false);
  const [rows, setRows] = useState([]);

    const handlerGetAllExp =  useCallback(async () => {
    const data = await getAllExp();
    setRows(data);
  }, []);

   useEffect(() => {
    handlerGetAllExp();
  }, [handlerGetAllExp]);

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
    const newData = await getAllExp();
    setLoading(false);
    setRows(newData);
    setEncontrado(true);
  };

  const buscar = async () => {
    //seteo nuevas rows setRows
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
  const changeSeachExtension = (event) => {
    setFieldsSearch({
      ...fieldsSearch,
      extension: event.target.value,
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
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Iniciador</TableCell>
                    <TableCell align="right">N° Expediente</TableCell>
                    <TableCell align="right">Año </TableCell>
                    <TableCell align="right">Prefijo </TableCell>
                    <TableCell align="right">Extracto </TableCell>
                    <TableCell align="right">Descargar </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows?.map((row) => (
                    <TableRow
                    key = {row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.starter}
                      </TableCell>
                      <TableCell align="right">{row.num}</TableCell>
                      <TableCell align="right">{row.year}</TableCell>
                      <TableCell align="right">{row.prefijo}</TableCell>
                      <TableCell align="right">{row.extension}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => download(row)}>
                          <FileDownloadIcon></FileDownloadIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : null}
      </Container>
    </>
  );
}
