import Head from "next/head";
import {
  Card,
  Checkbox,
  Container,
  Input,
  Loading,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { useAppContext } from "../context/DataContext";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const redirect = () => {
    setLoading(true);
    setTimeout(function () {
      setLoading(false);
    }, 2000);
  };

  return (
    /*  Aca va el login */

    <Container
      title="main"
      justify="center"
      display="flex"
      alignItems="center"
      css={{ height: "100vh" }}
    >
      <Card css={{ mw: "420px", p: "20px" }}>
        <Text
          size={24}
          weight="bold"
          css={{
            as: "center",
            mb: "20px",
          }}
        >
          Login
        </Text>
        <Input clearable bordered fullWidth placeholder="Usuario" size="lg" />
        <Spacer y={1} />
        <Input.Password
          clearable
          bordered
          fullWidth
          placeholder="Contraseña"
          size="lg"
        />
        <Spacer y={1} />
        <Row justify="space-between">
          <Checkbox>
            <Text size={14}>Remember me</Text>
          </Checkbox>
          <Text size={14}>Forgot password?</Text>
        </Row>
        <Spacer y={1} />
        <Row justify="center">
          {" "}
          <Link href={"/home"}>
            <Button onClick={redirect}>
              {" "}
              {loading ? (
                <Loading type="points" color="currentColor" size="sm" />
              ) : (
                "LOGIN"
              )}
            </Button>
          </Link>
        </Row>
      </Card>
    </Container>
  );
}
