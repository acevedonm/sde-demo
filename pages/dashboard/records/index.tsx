import { Container, MenuItem } from "@mui/material";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FilesService } from "../../../utils/files.service";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import LinearProgress from "@mui/material/LinearProgress";
import searchExp from "../../../firebase/searchExp";
import { Records } from "../../../src/interfaces/records";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import DynamicTable from "../../../components/DynamicTable";
import { handleDelete, handleModify, handleCreateNew } from "../../../firebase/crud";
import DynamicDialog from "../../../components/DynamicDialog";
import Switch from "@mui/material/Switch";

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
  const [openDialog, setOpenDialog] = useState({
    delete: false,
    modify: false,
    create: false,
  });
  const [modifyData, setModifyData] = useState({});
  const [newData, setNewData] = useState({
    prefix: "4069",
    num: "",
    year: new Date().getFullYear(),
    ext: "0",
    extract: "",
    starter: "",
    starterStreet: "",
    starterNum: "0",
    starterLocation: "",
    starterCp: "",
    type: "",
    date: "",
    status: "",
  });
  const [isComplete, setIsComplete] = useState(true);
  const [isNewComplete, setIsNewComplete] = useState(true);

  let staticHeaders = [
    "prefix",
    "num",
    "year",
    "extract",
    "ext",
    "starter",
    "starterStreet",
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

  const search = async () => {
    if (fieldsSearch.num.trim() === "") {
      setAlert(true);
      return;
    }
    setLoading(true);
    const newData = await searchExp(fieldsSearch, isComplete);
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

  const handleOpenDialog = (dialogType) => {
    if (dialogType === "modify" && rows.length > 0) {
      setModifyData(rows[0]); // Asigna el primer expediente a modificar
    }
    setOpenDialog((prev) => ({ ...prev, [dialogType]: true }));
  };

  const handleCloseDialog = (dialogType) => {
    setOpenDialog((prev) => ({ ...prev, [dialogType]: false }));
  };

  const handleConfirmCreate = async () => {
    await handleCreateNew(newData, isNewComplete);
    setOpenDialog((prev) => ({ ...prev, create: false }));
    // Actualiza la tabla si es necesario
  };

  const handleChangeNewData = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleConfirmDelete = async () => {
    await handleDelete(rows, setRows, isComplete);
    setOpenDialog((prev) => ({ ...prev, delete: false }));
  };

  const handleConfirmModify = async () => {
    await handleModify(rows, setRows, modifyData, isComplete);
    setOpenDialog((prev) => ({ ...prev, modify: false }));
  };

  const handleChangeModifyData = (e) => {
    const { name, value } = e.target;
    setModifyData({ ...modifyData, [name]: value });
  };

  const handleSwitchChange = (event) => {
    setIsComplete(event.target.checked); // Invertir el valor de isComplete
  };

  const handleNewSwitchChange = (event) => {
    setIsNewComplete(event.target.checked); // Invertir el valor de isNewComplete
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
              onClick={() => handleOpenDialog("create")}
              style={{ marginLeft: "10px", marginTop: "10px", height: "40px" }}
            >
              + Nuevo expediente
            </Button>
          </div>
          <div>
            <Switch
              checked={isComplete}
              onChange={handleSwitchChange}
              inputProps={{ "aria-label": "controlled" }}
            />
            {isComplete ? "Completo" : "Incompleto"}
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
              onPageChange={setCurrentPage}
              buttonAction={download}
            />
            <Box sx={{ marginTop: 2 }}>
              <Button sx={{ marginRight: 2 }}
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog("modify")}
                disabled
              >
                Modificar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleOpenDialog("delete")}
                disabled
              >
                Eliminar
              </Button>
            </Box>
          </>
        ) : null}
      </Container>

      <DynamicDialog
        open={openDialog.delete}
        title="Confirmar eliminación"
        onConfirm={handleConfirmDelete}
        onGenericAction={() => handleCloseDialog("delete")}
        genericActionLabel="Cancelar">
          ¿Está seguro de que desea eliminar este expediente?
        </DynamicDialog>

      <DynamicDialog
        open={openDialog.modify}
        title="Modificar expediente"
        context="Realice los cambios necesarios y confirme la modificación."
        onConfirm={handleConfirmModify}
        onGenericAction={() => handleCloseDialog("modify")}
        genericActionLabel="Cancelar"
      >
        {staticHeaders.map((header) => (
          <TextField
            sx={{ margin: 1 }}
            key={header}
            label={header}
            name={header}
            value={modifyData[header] || ""}
            onChange={handleChangeModifyData}
          />
        ))}
      </DynamicDialog>

      <DynamicDialog
        open={openDialog.create}
        title="Crear nuevo expediente"
        context="Complete los campos para crear un nuevo expediente."
        onConfirm={handleConfirmCreate}
        onGenericAction={() => handleCloseDialog("create")}
        genericActionLabel="Cancelar"
      >
        <Switch
          checked={isNewComplete} // Invertir la visualización del switch
          onChange={handleNewSwitchChange}
          inputProps={{ "aria-label": "controlled" }}
        />
        {isNewComplete ? "Completo" : "Incompleto"} {/* Invertir la etiqueta */}
        {staticHeaders.map((header) => (
          <TextField
            sx={{ margin: 1 }}
            key={header}
            label={header}
            name={header}
            value={newData[header] || ""}
            onChange={handleChangeNewData}
          />
        ))}
      </DynamicDialog>
    </>
  );
}
