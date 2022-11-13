import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LayoutDisplay } from "../src/components/LayoutDisplay";
import { db } from "../src/firebase/firebase";
import { Pagina } from "../src/types/pagina";
import academia from "../public/images/academia.png";
import pickadaf from "../public/images/takeadaf.png";
import sedershlishi from "../public/images/sedershlishi.png";
import { Center, Container, Title } from "@mantine/core";
import { FooterSimple } from "../src/components/Footer";

export default function Home() {
  const [paginas, setPaginas] = useState<Pagina[]>([]);
  useEffect(() => {
    const q = query(collection(db, "paginas"), orderBy("pagina"));
    onSnapshot(q, (data) => {
      const mapped = data.docs.map((d) => {
        const dF = d.data();
        return { pagina: dF["pagina"], lector: dF?.lector };
      });
      setPaginas(
        mapped.sort((a, b) => {
          return a.pagina.localeCompare(b.pagina, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        })
      );
    });
  }, []);
  return (
    <>
      <LayoutDisplay
        data={paginas}
        title={
          <>
            <Container>
              <Center>
                <Image width="400" src={pickadaf} alt="pick" />
              </Center>
            </Container>
            <Center>
              <Image width="100" src={academia} alt="academia" />
              <Image width="100" src={sedershlishi} alt="seder" />
            </Center>
          </>
        }
        description={
          <Center>
            <Title size={"h4"}>Masejet Taanit</Title>
          </Center>
        }
      />
      <FooterSimple />
    </>
  );
}
