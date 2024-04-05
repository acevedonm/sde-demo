import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  LinearProgress,
  TextField,
} from "@mui/material";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Grid } from "@mui/material";
import uploaderJob from "../../firebase/uploader-job-db";
import DynamicDialog from "../../components/DynamicDialog";
import uploadPDF from "../../firebase/uploadPDF";
import migrateDocuments from "../../firebase/migrate";
import deleteDocument from "../../firebase/delete";
import synchronizeFirestoreToAlgolia from "../../firebase/syncAlgoliaIndex";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const [selectedDir, setSelectedDir] = useState(null); //dice dir pero son varios pdf

  const [cargados, setCargados] = useState([]);

  const [noCargados, setNoCargados] = useState([]);

  const [dialogUploadingOpen, setDialogUploadingOpen] = useState(null);
  const [dialogInfo, setDialogInfo] = useState(null);

  const [yearToMigrate, setYearToMigrate] = useState("");

  const [recordDelete, setRecordDelete] = useState(null);

  
  const [yearSync, setYearSync] = useState(null);
  

  const handleFileListPDF = (event) => {
    setSelectedDir(event.target.files);
  };
  const handleMassivePDF = async () => {
    setDialogUploadingOpen(true);
    const nuevosCargados = [];
    const nuevosNoCargados = [];

    for (const file of selectedDir) {
      let pdfCargado = await uploadPDF(file, file.name);
      if (pdfCargado) {
        console.log(`PDF Cargado: ${file.name}`);
        nuevosCargados.push(file.name);
      } else {
        console.log(`Error al cargar PDF: ${file.name}`);
        nuevosNoCargados.push(file.name);
      }
    }

    setCargados((prevCargados) => [...prevCargados, ...nuevosCargados]);
    setNoCargados((prevNoCargados) => [...prevNoCargados, ...nuevosNoCargados]);

    setDialogUploadingOpen(false);
    setDialogInfo(true);
  };

  const handleDelete = async () => {
    await deleteDocument(recordDelete);
  };


  const changeYearSync = (event) => {
    setYearSync(event.target.value);
  };


  const handleSync = async () => {
    await synchronizeFirestoreToAlgolia(yearSync);
  };

  const changeRecordDelete = (event) => {
    setRecordDelete(event.target.value);
  };

  const changeYearMigration = (event) => {
    console.log("event.target.value ", event.target.value);
    setYearToMigrate(event.target.value);
  };

  const handleMigration = async () => {
    setDialogUploadingOpen(true);
    console.log({ yearToMigrate });
    await migrateDocuments(yearToMigrate);
    setDialogUploadingOpen(false);
    setDialogInfo(true);
  };

  const [descriptions, setDescriptions] = useState([
    "Carga una archivo CSV en la base de datos",
    "Elije un PDF para cargarlo en la base de datos",
    "Seleccione una carpeta con archivos PDF para cargarlos masivamente a la base de datos",
  ]);

  const handlerUploadJob = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handlerUploadPDFJob = (event) => {
    setLoading(true);
    //uploadPDFS
  };

  return (
    <Container>
      {loading ? (
        <Box sx={{ width: "50%" }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ minHeight: 150 }}>
              <CardContent>
                <Typography variant="body2">{descriptions[0]}</Typography>
              </CardContent>
              {selectedFile && (
                <Typography variant="body2" sx={{ marginTop: "16px" }}>
                  Archivo seleccionado: {selectedFile.name}
                </Typography>
              )}
              <CardActions sx={{ justifyContent: "space-between" }}>
                <Button size="small" component="label" variant="contained">
                  Cargar DB
                  <input
                    hidden
                    multiple
                    accept=".csv"
                    type="file"
                    onChange={handlerUploadJob}
                  />
                </Button>
                <Button
                  size="small"
                  component="label"
                  variant="contained"
                  onClick={() => uploaderJob(selectedFile, setLoading)}
                  disabled={!selectedFile}
                >
                  Confirmar
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ minHeight: 150 }}>
              <CardContent>
                <Typography variant="body2">{descriptions[1]}</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  component="label"
                  variant="contained"
                  disabled={true}
                >
                  Cargar PDF
                  <input
                    hidden
                    multiple
                    accept=".pdf"
                    type="file"
                    onChange={handlerUploadPDFJob}
                  />
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ minHeight: 150 }}>
              <CardContent>
                <Typography variant="body2">{descriptions[2]}</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button size="small" component="label" variant="contained">
                  Seleccionar Varios PDF
                  <input
                    hidden
                    multiple
                    accept=".pdf"
                    onChange={handleFileListPDF}
                    type="file"
                    id="file-pdf-massive"
                  />
                </Button>

                <Button
                  size="small"
                  component="label"
                  variant="contained"
                  onClick={handleMassivePDF}
                  disabled={!selectedDir}
                >
                  Carga Masiva de PDF
                </Button>
              </CardActions>
              <DynamicDialog
                title="Cargando PDF's Massivamente"
                open={dialogUploadingOpen}
              >
                <CircularProgress />
              </DynamicDialog>
              <DynamicDialog
                title="Informacion de carga"
                open={dialogInfo}
                onConfirm={() => setDialogInfo(false)}
                onCancel={() => setDialogInfo(false)}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <div>
                      <Typography>Cargados</Typography>
                      <List>
                        {cargados.map((c, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={c} />
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <Typography>No Cargados</Typography>
                      <List>
                        {noCargados.map((c, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={c} />
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  </Grid>
                </Grid>
              </DynamicDialog>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ minHeight: 150 }}>
              <CardContent>
                <Typography variant="body2">
                  Ejecutar una migracion por año
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <TextField
                  id="yearToMigration"
                  label="Año"
                  type="text"
                  onChange={changeYearMigration}
                />
                <Button
                  size="small"
                  component="label"
                  variant="contained"
                  onClick={handleMigration}
                >
                  Ejecutar Migracion
                </Button>
              </CardActions>
              <DynamicDialog
                title="Ejecutando migracion"
                open={dialogUploadingOpen}
              >
                <CircularProgress />
              </DynamicDialog>
              <DynamicDialog
                title="MIGRACION COMPLETA"
                open={dialogInfo}
                onConfirm={() => setDialogInfo(false)}
                onCancel={() => setDialogInfo(false)}
              >
                <CircularProgress />
              </DynamicDialog>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ minHeight: 150 }}>
              <CardContent>
                <Typography variant="body2">Elimina un expediente</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <TextField
                  id="delete"
                  label="Expediente"
                  type="text"
                  onChange={changeRecordDelete}
                />
                <Button
                  size="small"
                  component="label"
                  variant="contained"
                  onClick={handleDelete}
                >
                  Eliminar Expedientes
                </Button>
              </CardActions>
            </Card>
          </Grid>
          

          
          <Grid item xs={12} md={4}>
            <Card sx={{ minHeight: 150 }}>
              <CardContent>
                <Typography variant="body2">Sync Algolia firebase</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <TextField
                  id="sync"
                  label="Sync"
                  type="text"
                  onChange={changeYearSync}
                />
                <Button
                  size="small"
                  component="label"
                  variant="contained"
                  onClick={handleSync}
                >
                  Sync
                </Button>
              </CardActions>
            </Card>
          </Grid>


        </Grid>
      )}
    </Container>
  );
}
