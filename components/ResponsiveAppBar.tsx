import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import firebaseApp from "../firebase/client";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";

const pages = ["Buscador", "Carga de Expedientes", "Administracion "];
const settings = ["Perfil", "Configuracion", "Cerrar Sesión"];

const auth = getAuth(firebaseApp);

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const router = useRouter();

  const handleRouter = (href) => {
    handleCloseNavMenu();
    router.push(href);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOptionUserMenu = (e) => {
    const value = e.target.lastChild.nodeValue;
    switch (value) {
      case "Perfil":
        break;
      case "Configuracion":
        break;
      case "Dashboard":
        break;
      case "Cerrar Sesión":
        auth.signOut().then(
          function () {
            console.log("Signed Out");
          },
          function (error) {
            console.error("Sign Out Error", error);
          }
        );
        break;
      default:
        break;
    }
    setAnchorElUser(null);
  };
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem key={"buscador"} onClick={() => handleRouter("search")}>
                <Typography textAlign="center">Buscador</Typography>
              </MenuItem>
              <MenuItem
                key={"Carga de Expedientes"}
                onClick={() => handleRouter("upload")}
              >
                <Typography textAlign="center">Carga de Expedientes</Typography>
              </MenuItem>
              <MenuItem
                key={"Administracion"}
                onClick={() => handleRouter("dashboard")}
              >
                <Typography textAlign="center">Administracion</Typography>
              </MenuItem>
              <Button
                key={"buscador"}
                component="a"
                href="/search"
                sx={{
                  my: 2,
                  color: "",
                  display: "block",
                  ":hover": {
                    border: "1px solid #000000",
                  },
                }}
              >
                buscador
              </Button>
            </Menu>
          </Box>

          <Box
            component="img"
            sx={{
              height: "12vh",
            }}
            alt="Your logo."
            src="../assets/logo_gestion.png"
          />

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Button
              key={"buscador"}
              component="a"
              href="/search"
              sx={{
                my: 2,
                color: "white",
                display: "block",
                ":hover": {
                  border: "1px solid #000000",
                },
              }}
            >
              buscador
            </Button>
            <Button
              key={"upload"}
              component="a"
              href="/upload"
              sx={{
                my: 2,
                color: "white",
                display: "block",
                ":hover": {
                  border: "1px solid #000000",
                },
              }}
            >
              carga de expediente
            </Button>
            <Button
              key={"Administracion"}
              component="a"
              href="/dashboard"
              sx={{
                my: 2,
                color: "white",
                display: "block",
                ":hover": {
                  border: "1px solid #000000",
                },
              }}
            >
              Administracion
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleOptionUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
