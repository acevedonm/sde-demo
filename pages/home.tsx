import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import PageLayout from "../components/PageLayout";
import { Button, Container, Grid, Navbar, Text } from "@nextui-org/react";
import ModuleCard from "../components/ModuleCard";
import MyNavbar from "../components/MyNavbar";
import { useContext } from "react";
import { AppContext, AppWrapper, useAppContext } from "../context/DataContext";

export default function Home() {
  return (
    <Container title="main">
      <MyNavbar></MyNavbar>
      <Grid.Container gap={2}>
        <Grid xs={12} sm={4}>
          <ModuleCard
            title="Modulo de Carga"
            footerText="Descripcion del modulo"
            imageURL="https://media.istockphoto.com/id/808157510/es/foto/cerrar-tiro-de-mujeres-trabajando-en-un-soporte-de-equipo-da-instrucciones-t%C3%A9cnicas-con-la.jpg?s=1024x1024&w=is&k=20&c=iKbZCqeKkzpugncZ5QfGtNmM-vDT2bBt48yKqMk3oSI="
            redirectURL="modules/upload"
          ></ModuleCard>
        </Grid>
        <Grid xs={12} sm={4}>
          <ModuleCard
            title="Modulo de Busqueda"
            footerText="Descripcion del modulo"
            redirectURL="modules/graph"
            imageURL="https://media.istockphoto.com/id/1212785891/es/foto/una-mano-de-mujer-est%C3%A1-buscando-datos-en-una-carpeta-en-una-pantalla-digital.jpg?s=1024x1024&w=is&k=20&c=7jAQ44ykRJpW5loYCGXYNDf4ZO2IPtIMsrDq4n3KHfI="
          ></ModuleCard>
        </Grid>
        <Grid xs={12} sm={4}>
          <ModuleCard
            title="Modulo de Graficas"
            redirectURL="GraphModule"
            footerText="Descripcion del modulo"
            imageURL="https://images.pexels.com/photos/7947753/pexels-photo-7947753.jpeg"
          ></ModuleCard>
        </Grid>
      </Grid.Container>
    </Container>
  );
}
