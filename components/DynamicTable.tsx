import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

function DynamicTable({ data }) {
  if (!data || data.length === 0) {
    return <div>No hay datos disponibles.</div>;
  }

  const headers = Object.keys(data[0]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (
            <TableCell key={index}>{header}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            {headers.map((header, index) => (
              <TableCell key={index}>{item[header]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DynamicTable;