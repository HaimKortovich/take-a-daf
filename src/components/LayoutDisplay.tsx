import {
  Affix,
  Button,
  Card,
  Container,
  createStyles,
  Modal,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconCircleCheck, IconCircleDotted, TablerIcon } from "@tabler/icons";
import { MouseEventHandler, useEffect, useState } from "react";
import { Pagina } from "../types/pagina";
import { Notification as NotificationM } from "@mantine/core";
import { IconCheck } from "@tabler/icons";
import { AddPaginaInputInput } from "./AddPaginaInput";
import { async } from "@firebase/util";

interface FeatureProps {
  icon: TablerIcon;
  pagina: string;
  lector?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export function Feature({
  icon: Icon,
  pagina: title,
  lector: description = "Disponible",
  onClick,
}: FeatureProps) {
  const theme = useMantineTheme();
  const color = description === "Disponible" ? "green" : "dimmed";
  return (
    <Card withBorder onClick={onClick}>
      <ThemeIcon variant="light" size={40} radius={40}>
        <Icon size={20} stroke={1.5} />
      </ThemeIcon>
      <Text
        style={{
          textAlign: "center",
          marginTop: theme.spacing.sm,
        }}
      >
        {title}
      </Text>
      <Text
        size="sm"
        color={color}
        style={{ lineHeight: 1.6, textAlign: "center" }}
      >
        {description}
      </Text>
    </Card>
  );
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    marginBottom: theme.spacing.md,
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      fontSize: 28,
      textAlign: "left",
    },
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      textAlign: "left",
    },
  },
}));

interface FeaturesGridProps {
  title: React.ReactNode;
  description: React.ReactNode;
  data: Pagina[];
}

function OkNotification({ message }: { message: string }) {
  return (
    <NotificationM
      icon={<IconCheck size={18} />}
      color="teal"
      title="Teal notification"
    >
      {message}
    </NotificationM>
  );
}

export function LayoutDisplay({ title, description, data }: FeaturesGridProps) {
  const [notification, setNotification] = useState(false);
  const [opened, setOpened] = useState(false);
  const [nombre, setNombre] = useState<string>("");
  const [pagina, setPagina] = useState<string | null>(null);

  useEffect(() => {
    let timer = setTimeout(() => setNotification(false), 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [notification]);
  const { classes, theme } = useStyles();
  const features = data.map((feature, index) => {
    if (feature.lector) {
      return (
        <Feature key={feature.pagina} icon={IconCircleCheck} {...feature} />
      );
    } else {
      return (
        <>
          <Feature
            onClick={() => {
              setOpened(true);
              setPagina(feature.pagina);
            }}
            icon={IconCircleDotted}
            {...feature}
            key={feature.pagina}
          />
        </>
      );
    }
  });

  return (
    <Container className={classes.wrapper}>
      <Title className={classes.title}>{title}</Title>

      <Container size={560} p={0}>
        <Text size="sm" className={classes.description}>
          {description}
        </Text>
      </Container>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setNombre("");
          setPagina(null);
        }}
        title="Estudio a nombre"
      >
        <Container>
          <AddPaginaInputInput
            onChange={(e) => {
              e.preventDefault();
              setNombre(e.target.value);
            }}
            style={{ marginBottom: 10 }}
          />
          <Button
            disabled={nombre.length < 1}
            onClick={async () => {
              if (pagina && nombre) {
                await fetch("/api/addPagina", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ pagina: pagina, lector: nombre }),
                });
              }
              setNombre("");
              setPagina(null);
              setOpened(false);
              setNotification(true);
            }}
          >
            Estudia!
          </Button>
        </Container>
      </Modal>
      <SimpleGrid
        mt={60}
        cols={4}
        spacing={theme.spacing.md}
        breakpoints={[
          { maxWidth: 980, cols: 2, spacing: "xl" },
          { maxWidth: 755, cols: 1, spacing: "xl" },
        ]}
      >
        {features}
      </SimpleGrid>
      {notification && (
        <Affix position={{ bottom: 20, right: 20 }}>
          <OkNotification message="Entrada agregada" />
        </Affix>
      )}
    </Container>
  );
}
