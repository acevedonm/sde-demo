import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function DynamicDialog({
  title = "",
  context = "",
  onConfirm = null,
  onGenericAction = null,
  genericActionLabel = "",
  open,
  children,
}) {
  const handleClose = (event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    if (onGenericAction) {
      onGenericAction();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{context}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        {onGenericAction && (
          <Button onClick={onGenericAction}>{genericActionLabel}</Button>
        )}
        {onConfirm && (
          <Button onClick={onConfirm} variant="contained" autoFocus>
            Confirmar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default DynamicDialog;
