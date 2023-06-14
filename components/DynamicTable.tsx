import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
} from "@mui/material";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
// Objeto de traducción de inglés a español
const translations = {
  id: "id",
  prefix: "prefijo",
  date: "fecha",
  starterNum: "numero iniciador",
  num: "numero",
  type: "tipo",
  ext: "extension",
  starter: "iniciador",
  year: "año",
  starterLocation: "localidad iniciador",
  starterCp: "CP iniciador",
  extract: "extracto",
  extracto: "extracto",
  starterStreet: "calle iniciador",
  file: "PDF",
  status: "estado",
  code: "codigo",
};

function DynamicTable({ data, headers, buttonAction = (item?) => {} }) {
  if (!data || data.length === 0) {
    return <div>No hay datos disponibles.</div>;
  }

  // Mapeo de los encabezados para traducirlos
  const translatedHeaders = headers.map((header) =>
    translations[header].toUpperCase()
  );

  const handleButtonClick = (item) => {
    buttonAction(item);
  };

  return (
    <div style={{ maxWidth: "100%", overflowX: "auto" }}>
      <Table style={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
          <TableCell key="PDF">PDF</TableCell>
            {translatedHeaders.map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell align="right">
                <IconButton
              
                  onClick={() => handleButtonClick(item)}
                >
                  <FileDownloadIcon></FileDownloadIcon>
                </IconButton>
              </TableCell >
              {headers.map((header, index) => (
                <TableCell align="right" key={index}>{item[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DynamicTable;
