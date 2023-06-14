import { useEffect, useState } from "react";
import { Box, Button, Container, LinearProgress } from "@mui/material";
import { Card, CardContent, Typography, CardActions } from "@mui/material";
import { Grid } from "@mui/material";

import uploaderJob from "../../firebase/uploader-job-db";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const [descriptions, setDescriptions] = useState([
    "Carga una archivo CSV en la base de datos",
    "Elije una carpeta para cargar todos los archivos de tipo PDF",
    "Proximamente",
  ]);

  const handlerUploadJob = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  /*   const handlerUploadJob = (event) => {
    setLoading(true)
    uploaderJob(event,setLoading)
  }; */

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
                size="small" component="label" variant="contained"
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
                <Button size="small" component="label" variant="contained">
                  Cargar PDF
                  <input
                    hidden
                    multiple
                    accept=".csv"
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
                  new button
                  <input
                    hidden
                    multiple
                    accept=".csv"
                    type="file"
                    onChange={handlerUploadJob}
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
                  new button
                  <input
                    hidden
                    multiple
                    accept=".csv"
                    type="file"
                    onChange={handlerUploadJob}
                  />
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
