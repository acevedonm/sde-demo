import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { useContext } from "react";
import { AppContext, AppWrapper, useAppContext } from "../context/DataContext";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import * as React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

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
  const handleClick = () => {
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

  return (
    <>
      {" "}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Expediente cargado con éxito!
        </Alert>
      </Snackbar>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="outlined-basic" label="campo 1" variant="outlined" />
        <TextField id="filled-basic" label="campo 2" variant="filled" />
        <TextField id="standard-basic" label="campo 3" variant="standard" />
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
            <input hidden accept="image/*" multiple type="file" />
          </Button>
          <Button variant="contained" component="label" onClick={handleClick}>
            Guardar
          </Button>
        </Stack>
      </Box>
    </>
  );
}
