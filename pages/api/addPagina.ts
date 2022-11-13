import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../src/firebase/firebase_admin";
import { Pagina } from "../../src/types/pagina";

interface AddResponse {
  source?: Pagina;
  success: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddResponse>
) {
  if (req.method === "POST") {
    // Process a POST request
    const pagina: Pagina = req.body;
    const firestore = admin.firestore();
    const paginaRef = firestore.collection("paginas");
    const paginaExists = (await paginaRef.doc(pagina.pagina).get()).data();
    if (paginaExists) {
      if (pagina.lector === null) {
        await paginaRef.doc(pagina.pagina).set({ pagina: pagina.pagina });
        res.status(201).json({ success: true, source: pagina });
        return;
      }
      await paginaRef.doc(pagina.pagina).update(pagina);
      res.status(201).json({ success: true, source: pagina });
      return;
    }
    await paginaRef.doc(pagina.pagina).create(pagina);
    res.status(200).json({ success: true, source: pagina });
    return;
  } else {
    res.status(405).json({ success: false });
    return;
  }
}
