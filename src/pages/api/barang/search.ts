import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { s } = req.query;

  if (typeof s !== "string") {
    return res.status(400).json({ error: "Invalid query" });
  }

  try {
    const results = await prisma.barang.findMany({
      where: {
        nama: {
          contains: s,
        },
      },
    });

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to search barang" });
  }
}
