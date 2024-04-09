import Link from "next/link";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Box,
  useTheme,
  Switch,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useState } from "react";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SaveAsOutlinedIcon from "@mui/icons-material/SaveAsOutlined";

export default function Dashboard() {
  const cardContentStyle = {
    //flex: '1 0 auto', // Permite que el contenido crezca para ocupar el espacio disponible, empujando los CardActions hacia abajo
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const typographyTitleStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const theme = useTheme();

  const [userStatus, setUserStatus] = useState(false); // Estado para el switch que alterna los íconos

  const handleSwitchChange = (event) => {
    setUserStatus(event.target.checked); // Actualiza el estado basado en el switch
  };

  return (
    <Grid container spacing={2} style={{ padding: "20px" }}>
      <Grid item xs={12}>
        <Box display="flex" alignItems="center" mb={4}>
          <DashboardIcon
            fontSize="large"
            style={{
              color: theme.palette.primary.main, // Usa el color primario del tema
              marginRight: "8px",
            }}
          />
          <Typography
            variant="h4"
            component="div"
            style={{
              fontWeight: "bold",
              color: theme.palette.primary.main, // Usa el color primario del tema
              lineHeight: "normal",
            }}
          >
            Dashboard
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Switch
              checked={userStatus}
              onChange={handleSwitchChange}
              inputProps={{ "aria-label": "control de estado de usuarios" }}
            />
          </Box>
        </Box>
      </Grid>

      {/* Card 1 */}
      <Grid item xs={4}>
        <Card variant="outlined">
          <CardContent sx={cardContentStyle}>
            <SaveAsOutlinedIcon
              sx={{
                mb: 2,
                fontSize: "7rem",
                color: theme.palette.primary.main,
              }}
            />
            <Typography variant="h5" component="div" sx={typographyTitleStyle}>
              Bases de Datos
            </Typography>
            <Typography variant="body2">
              Realiza tareas en la base de datos.
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Link href="/dashboard/database" passHref>
              <Button size="small">Ir a Base de Datos</Button>
            </Link>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={4}>
        <Card variant="outlined">
          <CardContent sx={cardContentStyle}>
            <DescriptionOutlinedIcon
              sx={{
                mb: 2,
                fontSize: "7rem",
                color: theme.palette.primary.main,
              }}
            />
            <Typography variant="h5" component="div" sx={typographyTitleStyle}>
              Expedientes
            </Typography>
            <Typography variant="body2">
              Realiza tareas en los expedientes de la base de datos.
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Link href="/dashboard/records" passHref>
              <Button size="small">Ir a Expedientes</Button>
            </Link>
          </CardActions>
        </Card>
      </Grid>
      {/* Card 3 */}
      <Grid item xs={4}>
        <Card variant="outlined">
          <CardContent sx={cardContentStyle}>
            <PeopleAltOutlinedIcon
              sx={{
                mb: 2,
                fontSize: "7rem",
                color: theme.palette.primary.main,
              }}
            />
            <Typography variant="h5" component="div" sx={typographyTitleStyle}>
              Usuarios
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
              Realiza tareas en los usuarios de la aplicación.
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Link href="/dashboard/users" passHref>
              <Button size="small">Ir a Usuarios</Button>
            </Link>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}
