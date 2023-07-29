import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define the TypeScript interface for the request
interface RemoveBarangRequest {
  id: number;
}

// Define the TypeScript interface for the response
interface RemoveBarangResponse {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RemoveBarangResponse>
) {
  if (req.method === "DELETE") {
    try {
      const { id } = req.body as RemoveBarangRequest;

      // Check if the provided ID exists in the database
      const existingBarang = await prisma.barang.findUnique({
        where: { id },
      });

      if (!existingBarang) {
        return res.status(404).json({ message: "Barang not found" });
      }

      // Delete the barang from the database
      await prisma.barang.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Barang successfully removed" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to remove barang" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
