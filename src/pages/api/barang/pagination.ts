import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { page = 1, pageSize = 10 } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedPageSize = parseInt(pageSize as string, 10);

    try {
      const total = await prisma.barang.count();
      const barangList = await prisma.barang.findMany({
        skip: (parsedPage - 1) * parsedPageSize,
        take: parsedPageSize,
        orderBy: {
          id: "desc", // Order by id from max to min
        },
      });

      res.status(200).json({ barangList, total });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch data" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
