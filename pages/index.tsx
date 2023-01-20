import { Container } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import * as React from "react";
import { useAppContext } from "../context/DataContext";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

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
import { FilesService } from "../utils/files.service";
import ResponsiveAppBar from "../components/ResponsiveAppBar";

function generate(element: React.ReactElement) {
  return [0].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

function download() {
  console.log("descargando");
  FilesService.downloadFile("./assets/ConstanciaCBU.pdf", "constanciaCBU.pdf");
}

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function Home() {
  const [encontrado, setEncontrado] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const redirect = () => {
    setLoading(true);
    setTimeout(function () {
      setLoading(false);
    }, 2000);
  };

  const buscar = () => {
    console.log("buscando");
    setEncontrado(true);
  };
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  return (
    /*  Aca va el login */
    <>
      <ResponsiveAppBar></ResponsiveAppBar>
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
            <TextField id="outlined-search" label="Iniciador" type="search" />
            <TextField
              disabled
              id="outlined-search"
              label="Prefijo"
              defaultValue="4069"
              type="search"
            />
            <TextField id="outlined-search" label="N°" type="search" />
          </div>
          <div>
            <TextField id="outlined-search" label="Año" type="search" />
            <TextField id="outlined-search" label="Extension" type="search" />
          </div>
          <Button variant="contained" onClick={buscar}>
            Buscar
          </Button>
        </Box>
        {encontrado ? (
          <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Resultados
              </Typography>
              <a
                href="/assets/constanciaCBU.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="prueba.pdf"
              >
                Download FIle
              </a>
              <Demo>
                <List dense={dense}>
                  {generate(
                    <ListItem>
                      <ListItemIcon>
                        <FolderIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Exp. 1111/2015"
                        secondary={secondary ? "Secondary text" : null}
                      />
                    </ListItem>
                  )}
                </List>
              </Demo>
            </Grid>
          </Box>
        ) : null}
      </Container>
    </>
  );
}
