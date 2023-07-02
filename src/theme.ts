import { Roboto } from "@next/font/google";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#55BFE0",
      contrastText: "#fff",
    },
    secondary: {
      main: "#fffff",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          minWidth: 650,
          border: "1px solid #000",
          // Agrega tus estilos personalizados para la tabla aquí
          // Por ejemplo:
          // fontSize: "12px",
          // backgroundColor: "#f3f3f3",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          // Agrega tus estilos personalizados para las celdas de la tabla aquí
          // Por ejemplo:
          fontSize: "15px",
          // fontWeight: "bold",
          // color: "red",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "&.required-field .MuiInputBase-root": {
            border: "1px solid red !important",
          },
        },
      },
    },
  },
});

export default theme;
