import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "DELETE":
        const { id: deleteId } = z
          .object({ id: z.array(z.string()) })
          .parse(req.query);
        const deletedExpert = await prisma.expert.delete({
          where: { id: deleteId[0] },
        });

        return res.status(200).json(deletedExpert);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Invalid request body",
    });
  }
}
