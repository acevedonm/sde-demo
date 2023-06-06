import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import * as React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Container } from "@mui/material";
import createExp from "../../firebase/createExp";
import FieldsUpload from "../../src/interfaces/fieldsUpload";
import uploadPDF from "../../firebase/uploadPDF";
import { Expedientes } from "../../src/interfaces/expedientes";
import DynamicAlert from "../../components/DynamicAlert";

export interface State extends SnackbarOrigin {
  open: boolean;
}

export default function Upload() {
  const [open, setOpen] = React.useState(false);

  const [error, setError] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [PDF, setPDF] = React.useState(null);
  const [namePDF, setNamePDF] = React.useState("");
  const [fields, setFields] = React.useState({
    starter: "",
    prefijo: "4069",
    num: "",
    year: "",
    extension: "",
  });

  const handleChangePDF = (event) => {
    setPDF(event.target.files[0]);
    setNamePDF(event.target.files[0].name);
  };
  const handleSave = () => {
    if (!PDF) {
      setAlertMessage("No se ha seleccionado ningún PDF.");
      setError(true);
      return;
    }

    // Verificar si faltan campos en 'fields'
    if (
      !fields.starter ||
      !fields.prefijo ||
      !fields.num ||
      !fields.year ||
      !fields.extension
    ) {
      setAlertMessage("Faltan campos obligatorios.");
      setError(true);
      return;
    }

    try {
      createExp(fields, PDF);
      setOpen(true);

      setAlertMessage("¡Expediente cargado con éxito!");
      clearFields();
    } catch (error) {
      console.log("error en handle save: ", error);
      setError(true);
    }
  };

  const clearFields = () => {
    setFields({
      starter: "",
      prefijo: "4069",
      num: "",
      year: "",
      extension: "",
    });
  };
  const handleClose = () => {
    setOpen(false);
    setError(false);
  };
  const changeStarter = (event) => {
    setFields({
      ...fields,
      starter: event.target.value,
    });
  };

  const changeNum = (event) => {
    setFields({
      ...fields,
      num: event.target.value,
    });
  };

  const changeYear = (event) => {
    setFields({
      ...fields,
      year: event.target.value,
    });
  };

  const changeExtension = (event) => {
    setFields({
      ...fields,
      extension: event.target.value,
    });
  };

  return (
    <>
      {" "}
      <Container>
        <DynamicAlert
          open={open}
          severity="success"
          message={alertMessage}
          handleClose={handleClose}
        />
        <DynamicAlert
          open={error}
          severity="error"
          message={alertMessage}
          handleClose={handleClose}
        />
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
              onChange={changeStarter}
              value={fields.starter}
            />
            <TextField
              disabled
              id="outlined-search"
              label="Prefijo"
              defaultValue="4069"
              type="search"
              value={fields.prefijo}
            />
            <TextField
              id="outlined-search"
              label="N°"
              type="search"
              onChange={changeNum}
              value={fields.num}
            />
          </div>
          <div>
            <TextField
              id="outlined-search"
              label="Año"
              type="search"
              onChange={changeYear}
              value={fields.year}
            />
            <TextField
              id="outlined-search"
              label="Extension"
              type="search"
              onChange={changeExtension}
              value={fields.extension}
            />
          </div>
        </Box>
        <Box
          component="form"
          sx={{
            marginLeft: "50px",
          }}
          noValidate
          autoComplete="off"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="contained" component="label" color="info">
              Cargar PDF
              <input
                hidden
                accept="image/*,.pdf"
                multiple
                type="file"
                onChange={handleChangePDF}
              />
            </Button>

            <Button variant="contained" component="label" onClick={handleSave}>
              Guardar
            </Button>
          </Stack>
          {namePDF != "" ? <strong>{namePDF}</strong> : null}
        </Box>
      </Container>
    </>
  );
}
