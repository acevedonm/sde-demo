import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import SourceIcon from "@mui/icons-material/Source";
import FeatureCards from "../components/FeatureCards";
import Charts from "../components/Charts";
import Divider from "../components/Divider";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
function Welcome() {
  const [open, setOpen] = React.useState(false);

  const [tutorial, setTutorial] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    handleClickOpen();
  }, []);

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Sistema de Digitalizacion de Expedientes
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Bienvenido al sistema de digitalizacion, busqueda y archivado de
            expedientes de la Municipalidad de Luján.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Aceptar
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <Welcome />
      <FeatureCards />
      <Divider  text={"Graficos y estadisticas"}/>
      <Charts />
    </div>
  );
}
