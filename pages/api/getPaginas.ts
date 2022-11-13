import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../src/firebase/firebase_admin";
import { Pagina } from "../../src/types/pagina";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pagina[]>
) {
  console.log(process.env.FIREBASE_ADMIN_project_id);
  const firestore = admin.firestore();
  const paginaRef = firestore.collection("paginas");
  const snapshot = await paginaRef.orderBy("pagina", "asc").get();
  const paginas: Pagina[] = [];
  snapshot.forEach((doc) => {
    paginas.push(doc.data() as any);
  });
  res.status(200).json(paginas);
}
