import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { useContext, useEffect, useState } from "react";
import {
  AppContext,
  AppWrapper,
  useAppContext,
} from "../../context/DataContext";
import ResponsiveAppBar from "../../components/ResponsiveAppBar";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  LinearProgress,
  Stack,
} from "@mui/material";
import Papa from "papaparse";
import Paper from "@mui/material/Paper";

import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import uploaderJob from "../../firebase/uploader-job-db";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

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

 

  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);

  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);

  //State to store the values
  const [values, setValues] = useState([]);

  const handlerUploadJob = (event) => {
    setLoading(true)
    uploaderJob(event)
/*     Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        results.data.map((d) => {
          console.log("cargando DB... ")
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });

         // Parsed Data Response in array format
        setParsedData(results.data);

        // Filtered Column Names
        setTableRows(rowsArray[0]);

        // Filtered Values
        setValues(valuesArray); 
      },
    }); */

    setLoading(false)
  };

  return (
     <Container>
        {loading ? (
          <Box sx={{ width: "50%" }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        ) : (
          <>
            <Button size="large" component="label" variant="contained">
              Cargar DB
              <input
                hidden
                multiple
                accept=".csv"
                type="file"
                onChange={handlerUploadJob}
              />
            </Button>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, marginTop: "500px" }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {tableRows.map((rows, index) => {
                      return <TableCell align="right" key={index}>{rows}</TableCell>;
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.map((value, index) => {
                    return (
                      <TableRow key={index}>
                        {value.map((val, i) => {
                          return <TableCell key={i}>{val}</TableCell>;
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Container>
  );
}
