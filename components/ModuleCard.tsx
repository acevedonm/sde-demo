import { Card, Text, Row, Col, Button } from "@nextui-org/react";
import type { NextPage } from "next";
import Link from "next/link";

interface Props {
  title: string;
  imageURL: string;
  footerText: string;
  redirectURL: string;
}
const ModuleCard: NextPage<Props> = (props) => {
  const { title, imageURL, footerText, redirectURL } = props;

  return (
    <Card>
      <Card.Header css={{ position: "absolute", top: 5 }}>
        <Col>
          <Text h4 weight="bold" color="#9E9E9E">
            {title}
          </Text>
        </Col>
      </Card.Header>
      <Card.Image src={imageURL}></Card.Image>
      <Card.Footer
        isBlurred
        css={{ position: "absolute", bgBlur: "#0f111466", bottom: "0" }}
      >
        <Row>
          <Col>
            <Text color="#d1d1d1" size={18}>
              {footerText}
            </Text>
          </Col>
          <Col>
            <Row justify="flex-end">
              <Link href={`/${redirectURL}`}>
                <Button flat auto rounded color="primary">
                  <Text
                    css={{ color: "inherit" }}
                    size={12}
                    weight="bold"
                    transform="uppercase"
                  >
                    IR AL MODULO
                  </Text>
                </Button>
              </Link>
            </Row>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default ModuleCard;
