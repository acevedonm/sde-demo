import { Container } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import * as React from "react";
import { useAppContext } from "../../context/DataContext";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { data, Expedientes } from "../../utils/data";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FolderIcon from "@mui/icons-material/Folder";
import useDownloader from "react-use-downloader";
import { styled } from "@mui/material/styles";
import { FilesService } from "../../utils/files.service";
import ResponsiveAppBar from "../../components/ResponsiveAppBar";
import IconButton from "@mui/material/IconButton";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import getAllExp from "../../firebase/getAllExp";
import LinearProgress from "@mui/material/LinearProgress";
import searchExp from "../../firebase/searchExp";

function createData(
  id: number,
  starter: string,
  num: string,
  year: string,
  prefijo: string,
  extension: string
): Expedientes {
  return { id, starter, num, year, prefijo, extension };
}

function generate(element: React.ReactElement) {
  return [0].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

function download(data: Expedientes) {
  FilesService.downloadFile(
    `./assets/${data.prefijo}-${data.num}-${data.year}.pdf`,
    `${data.prefijo}-${data.num}-${data.year}.pdf`
  );
}

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function Search() {
  const [encontrado, setEncontrado] = React.useState(false);

  const inicialRows = data.map((element) =>
    createData(
      element.id,
      element.starter,
      element.num,
      element.year,
      "4069",
      "24"
    )
  );

  const [rows, setRows] = React.useState(inicialRows);
  const [fieldsSearch, setFieldsSearch] = React.useState({
    starter: "",
    prefijo: "4069",
    num: "",
    year: "",
    extension: "",
  });

  const [loading, setLoading] = React.useState(false);

  const redirect = () => {
    setLoading(true);
    setTimeout(function () {
      setLoading(false);
    }, 2000);
  };

  const [alert, setAlert] = React.useState(false);

  const verTodos = async () => {
    //seteo nuevas rows setRows
    setAlert(false);
    setLoading(true);
    const newData = await getAllExp();
    setLoading(false);
    setRows(newData);
    setEncontrado(true);
  };

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
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

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
              id="outlined-search"
              label="Iniciador"
              type="search"
              onChange={changeSeachStarter}
            />
            <TextField
              disabled
              id="outlined-search"
              label="Prefijo"
              defaultValue="4069"
              type="search"
            />
            <TextField
              id="outlined-search"
              label="N°"
              type="search"
              onChange={changeSeachNum}
            />
          </div>
          <div>
            <TextField
              id="outlined-search"
              label="Año"
              type="search"
              onChange={changeSeachYear}
            />
            <TextField
              id="outlined-search"
              label="Extension"
              type="search"
              onChange={changeSeachExtension}
            />
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
                    <TableCell align="right">Año </TableCell>{" "}
                    <TableCell align="right">Prefijo </TableCell>
                    <TableCell align="right">Extensión </TableCell>
                    <TableCell align="right">Descargar </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow
                      key={row.id}
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
