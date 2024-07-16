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
import uploaderJob from "../../../firebase/uploader-job-db";
import DynamicDialog from "../../../components/DynamicDialog";
import uploadPDF from "../../../firebase/uploadPDF2";
import migrateDocuments from "../../../firebase/migrate";
import deleteDocument from "../../../firebase/delete";
import synchronizeFirestoreToAlgolia from "../../../firebase/syncAlgoliaIndex";
import CheckIcon from "@mui/icons-material/Check";

export default function DataBase() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const [selectedDir, setSelectedDir] = useState(null); //dice dir pero son varios pdf

  const [cargados, setCargados] = useState([]);

  const [noCargados, setNoCargados] = useState([]);

  const [dialogAwaitOpen, setDialogAwaitOpen] = useState({
    open: false,
    dialog: "",
  });

  const [dialogInfo, setDialogInfo] = useState({ open: false, dialog: "" });

  const [yearToMigrate, setYearToMigrate] = useState("");

  const [recordDelete, setRecordDelete] = useState(null);

  const [yearSync, setYearSync] = useState(null);

  const handleFileListPDF = (event) => {
    setSelectedDir(event.target.files);
  };
  const handleMassivePDF = async () => {
    setDialogAwaitOpen({ open: true, dialog: "uploadPDF" });
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

    setDialogAwaitOpen({ open: false, dialog: "" });
    setDialogInfo({ open: true, dialog: "uploadPDF" });
  };

  const handleDelete = async () => {
    await deleteDocument(recordDelete);
  };

  const changeYearSync = (event) => {
    setYearSync(event.target.value);
  };

  const handleSync = async () => {
    setDialogAwaitOpen({ open: true, dialog: "sync" });
    await synchronizeFirestoreToAlgolia(yearSync);
    setDialogInfo({ open: true, dialog: "sync" });
    setDialogAwaitOpen({ open: false, dialog: "" });
  };

  const changeRecordDelete = (event) => {
    setRecordDelete(event.target.value);
  };

  const changeYearMigration = (event) => {
    console.log("event.target.value ", event.target.value);
    setYearToMigrate(event.target.value);
  };

  const handleMigration = async () => {
    setDialogAwaitOpen({ open: true, dialog: "migrate" });
    await migrateDocuments(yearToMigrate);
    setDialogAwaitOpen({ open: false, dialog: "" });
    setDialogInfo({ open: true, dialog: "migrate" });
  };

  const handlerUploadJob = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handlerUploadPDFJob = (event) => {
    setLoading(true);
    //uploadPDFS
  };

  const downloadReport = () => {
    const csvRows = [];
    const headers = ["Archivo", "Estado"];
    csvRows.push(headers.join(','));
  
    // Agregar los cargados al reporte
    cargados.forEach(cargado => {
      csvRows.push([cargado, "Cargado"].join(','));
    });
  
    // Agregar los no cargados al reporte
    noCargados.forEach(noCargado => {
      csvRows.push([noCargado, "No Cargado"].join(','));
    });
  
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
  
    link.setAttribute("href", url);
    link.setAttribute("download", "reporte_carga.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <Typography variant="body2">
                  Carga una archivo CSV en la base de datos
                </Typography>
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
                    disabled
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
                <Typography variant="body2">
                  {" "}
                  Elije un PDF para cargarlo en la base de datos
                </Typography>
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
                <Typography variant="body2">
                  Seleccione una carpeta con archivos PDF para cargarlos
                  masivamente a la base de datos
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  component="label"
                  variant="contained"
                >
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
                open={
                  dialogAwaitOpen.open && dialogAwaitOpen.dialog == "uploadPDF"
                }
              >
                <CircularProgress />
              </DynamicDialog>
              <DynamicDialog
                title="Informacion de carga"
                open={dialogInfo.open && dialogInfo.dialog == "uploadPDF"}
                onConfirm={() => {setDialogInfo({ open: false, dialog: "" })
                setCargados([]);
                setNoCargados([]);
                }}
                onGenericAction={() => {
                  setDialogInfo({ open: false, dialog: "" });
                  downloadReport();
                }}
                genericActionLabel="Descargar Reporte"
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
                open={
                  dialogAwaitOpen.open && dialogAwaitOpen.dialog == "migrate"
                }
              >
                <CircularProgress />
              </DynamicDialog>
              <DynamicDialog
                title="MIGRACION COMPLETA"
                open={dialogInfo.open && dialogInfo.dialog == "migrate"}
                onConfirm={() => setDialogInfo({ open: false, dialog: "" })}
              >
                <></>
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
                  label="Año"
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
              <DynamicDialog
                title="Ejecutando Syncronizacion con Algolia"
                open={dialogAwaitOpen.open && dialogAwaitOpen.dialog == "sync"}
              >
                <CircularProgress />
              </DynamicDialog>
              <DynamicDialog
                title="SYNCRONIZACION COMPLETA"
                open={dialogInfo.open && dialogInfo.dialog == "sync"}
                onConfirm={() => setDialogInfo({ open: false, dialog: "" })}
              >
                <></>
              </DynamicDialog>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
