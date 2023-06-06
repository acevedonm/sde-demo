import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function DynamicAlert({ open, severity, message, handleClose }) {
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    handleClose();
  };

  const handleAlertClose = (event) => {
    handleSnackbarClose(event, null);
  };


  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      autoHideDuration={3000}
      onClose={handleSnackbarClose}
    >
      <MuiAlert
      elevation={6} variant="filled"
        onClose={handleAlertClose}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
}

export default DynamicAlert;
