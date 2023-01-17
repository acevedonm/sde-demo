import { Card, Text, Row, Col, Button, Navbar } from "@nextui-org/react";
import type { NextPage } from "next";
const MyNavbar: NextPage = () => {
  return (
    <Navbar isCompact variant={"static"}>
      <Navbar.Brand>
        <Text b color="inherit">
          Sistema de Digitalizacion de Expedientes
        </Text>
      </Navbar.Brand>
      <Navbar.Content hideIn={"md"}>
        <Navbar.Link href="#">Modulo de Carga</Navbar.Link>
        <Navbar.Link href="#">Modulo de Busqueda</Navbar.Link>
        <Navbar.Link href="#">Modulo de Graficas</Navbar.Link>
      </Navbar.Content>
      <Navbar.Content>
        <Navbar.Link>Profile</Navbar.Link>
        <Navbar.Item>
          <Button auto flat href="#">
            Logout
          </Button>
        </Navbar.Item>
      </Navbar.Content>
    </Navbar>
  );
};

export default MyNavbar;
