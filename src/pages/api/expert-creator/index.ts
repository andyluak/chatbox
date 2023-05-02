import { Expert } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

import { prisma } from "~/server/db";

const expertBodySchema = z.object({
  data: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    prompt: z.string().min(1),
    variables: z.array(z.string()).optional(),
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        const { data } = expertBodySchema.parse(req.body);
        const expert = await prisma.expert.create({
          data,
        });
        return res.status(200).json({ expert });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Invalid request body",
    });
  }
}
