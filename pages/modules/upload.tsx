import {
  Button,
  Card,
  Container,
  Grid,
  Input,
  Navbar,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";
import Link from "next/link";
import ModuleCard from "../../components/ModuleCard";
import MyNavbar from "../../components/MyNavbar";

export default function UploadModule() {
  return (
    <Container title="main" justify="center" display="flex" alignItems="center">
      <MyNavbar></MyNavbar>
      <Card css={{ mw: "420px", p: "20px" }}>
        <Text
          size={24}
          weight="bold"
          css={{
            as: "center",
            mb: "20px",
          }}
        >
          Cargar Expediente
        </Text>
        <Input clearable bordered fullWidth placeholder="DATO 1" size="lg" />
        <Spacer y={1} />
        <Input clearable bordered fullWidth placeholder="DATO 2 " size="lg" />
        <Spacer y={1} />
        <Input clearable bordered fullWidth placeholder="DATO 3" size="lg" />
        <Spacer y={1} />
        <Input clearable bordered fullWidth placeholder="DATO 4" size="lg" />

        <Spacer y={1} />
        <Row justify="center">
          {" "}
          <label
            style={{
              border: "1px",
              display: "inlineBlock",
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            <input type="file" />
          </label>
        </Row>
        <Row justify="center"></Row>

        <Spacer y={4} />
        <Row justify="center">
          {" "}
          <Button>ENVIAR</Button>
        </Row>
      </Card>
    </Container>
  );
}
