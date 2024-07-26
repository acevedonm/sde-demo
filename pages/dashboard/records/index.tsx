import { Container, MenuItem } from "@mui/material";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FilesService } from "../../../utils/files.service";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { getExpedientesPorPagina } from "../../../firebase/getAllExp";
import LinearProgress from "@mui/material/LinearProgress";
import searchExp from "../../../firebase/searchExp";
import { Records } from "../../../src/interfaces/records";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import DynamicTable from "../../../components/DynamicTable";
import { handleDelete, handleModify } from "../../../firebase/crud"; // Importa las funciones aquí

const storage = getStorage();

function download(data: Records) {
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
  const [currentPage, setCurrentPage] = useState(0);

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
          <strong>Revise los campos de búsqueda</strong>
        </Alert>
      </Stack>
    );
  }

  const verTodos = async () => {
    setAlert(false);
    setLoading(true);
    const newData = await getExpedientesPorPagina(0, 10, true);
    setLoading(false);
    setRows(newData);
    setEncontrado(true);
    setCurrentPage(0);
  };

  const search = async () => {
    if (fieldsSearch.num.trim() === "") {
      setAlert(true);
      return;
    }
    setLoading(true);
    const newData = await searchExp(fieldsSearch);
    setRows(newData);
    setEncontrado(true);
    setLoading(false);
    if (newData.length === 0) {
      setAlert(true);
    } else {
      setAlert(false);
    }
    setCurrentPage(0);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      search();
    }
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

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleCreateNew = () => {
    // Lógica para crear un nuevo expediente
    console.log("Crear nuevo expediente");
  };

  return (
    <>
      {alert ? <IconAlerts /> : null}
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
              id="num"
              label="N°"
              type="search"
              onChange={changeSeachNum}
              onKeyDown={handleKeyDown}
              required
              error={alert && fieldsSearch.num.trim() === ""}
              helperText={alert && fieldsSearch.num.trim() === "" ? "Este campo es obligatorio" : ""}
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
                      maxHeight: 200,
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
            <Button
              variant="contained"
              onClick={handleCreateNew}
              style={{ marginLeft: "10px", marginTop: "10px", height: "40px" }}
            >
             + Nuevo expediente
            </Button>
          </div>
          <Button
            variant="contained"
            onClick={search}
            style={{ marginRight: "10px", marginBottom: "10px"}}
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
          <>
            <DynamicTable
              data={rows}
              headers={staticHeaders}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              buttonAction={download}
            />
            <Box sx={{ marginTop: 2 }}>
              <Button sx={{ marginRight: 2 }}
                variant="contained"
                color="primary"
                onClick={() => handleModify(rows)} // Usa la función importada aquí
                disabled={rows.length === 0}
              >
                Modificar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(rows, setRows)} // Usa la función importada aquí
                disabled={rows.length === 0}
              >
                Eliminar
              </Button>
            </Box>
          </>
        ) : null}
      </Container>
    </>
  );
}
