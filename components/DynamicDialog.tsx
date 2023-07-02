import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function DynamicDialog({ title="",context="",  onConfirm = null, onCancel = null, open,children }) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {context}
        </DialogContentText>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {children}
        </div>
      </DialogContent>
      {onConfirm && onCancel && (
        <DialogActions>
          <Button onClick={onCancel}>Cancelar</Button>
          <Button onClick={onConfirm} variant="contained" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      )}
     
    </Dialog>
  );
}

export default DynamicDialog;