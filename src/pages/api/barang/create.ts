import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { type Barang } from "~/utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { foto, nama, harga_beli, harga_jual, stok } = req.body as Barang;
      console.log(req.body);

      const newBarang = await prisma.barang.create({
        data: {
          foto: typeof foto === "string" ? foto : "",
          nama,
          harga_beli: parseInt(`${harga_beli}`),
          harga_jual: parseInt(`${harga_jual}`),
          stok: parseInt(`${stok}`),
        },
      });

      res.status(201).json(newBarang);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create new barang" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
