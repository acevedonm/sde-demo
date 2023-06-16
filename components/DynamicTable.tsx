import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  TablePagination,
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

function DynamicTable({ data, headers, buttonAction = (item?) => {} , currentPage, onPageChange }) {
  if (!data || data.length === 0) {
    return <div>No hay datos disponibles.</div>;
  }


  const pageSize = 10; // Número de elementos por página
  const totalPages = Math.ceil(data.length / pageSize);


  // Mapeo de los encabezados para traducirlos
  const translatedHeaders = headers.map((header) =>
    translations[header].toUpperCase()
  );

  //Esto se usa por si recibo una accion para ejecutar en el boton de la tabla
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
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={data.length}
        rowsPerPage={pageSize}
        page={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default DynamicTable;
