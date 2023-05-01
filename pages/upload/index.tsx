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

export interface State extends SnackbarOrigin {
  open: boolean;
}

export default function Upload() {
  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  
  const [open, setOpen] = React.useState(false);
  const [PDF, setPDF] = React.useState({});
  const [fields, setFields] = React.useState({
    starter: "",
    prefijo: "4069",
    num: "",
    year: "",
    extension: "",
  });

  const handleClick = () => {
    createExp(fields,PDF);
    setOpen(true);
  };
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
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
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Expediente cargado con éxito!
          </Alert>
        </Snackbar>
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
              onChange={changeNum}
            />
          </div>
          <div>
            <TextField
              id="outlined-search"
              label="Año"
              type="search"
              onChange={changeYear}
            />
            <TextField
              id="outlined-search"
              label="Extension"
              type="search"
              onChange={changeExtension}
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
              Cargar Expediente
              <input hidden accept="image/*,.pdf" multiple type="file" onChange={e => setPDF(e.target.files[0])}/>
            </Button>
            <Button variant="contained" component="label" onClick={handleClick}>
              Guardar
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
}
