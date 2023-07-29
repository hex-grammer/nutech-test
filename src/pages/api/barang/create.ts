import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import type { Barang } from "~/utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { id, foto, nama, harga_beli, harga_jual, stok } =
        req.body as Barang;

      if (id) {
        // If id exists, update the existing record
        const updatedBarang = await prisma.barang.upsert({
          where: { id },
          update: {
            foto: typeof foto === "string" ? foto : "",
            nama,
            harga_beli: parseInt(`${harga_beli}`),
            harga_jual: parseInt(`${harga_jual}`),
            stok: parseInt(`${stok}`),
          },
          create: {
            foto: typeof foto === "string" ? foto : "",
            nama,
            harga_beli: parseInt(`${harga_beli}`),
            harga_jual: parseInt(`${harga_jual}`),
            stok: parseInt(`${stok}`),
          },
        });

        res.status(200).json(updatedBarang);
      } else {
        // If id does not exist, create a new record
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
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create/update barang" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
