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

export const expertBodySchemaOptional = expertBodySchema.extend({
  data: expertBodySchema.shape.data.partial().extend({
    id: z.string(),
  }),
});

export type ExpertBodyData = z.infer<typeof expertBodySchema>["data"];
export type ExpertBodyDataOptional = z.infer<typeof expertBodySchemaOptional>;

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
        return res.status(200).json(expert);

      case "GET":
        const experts = await prisma.expert.findMany();
        return res.status(200).json(experts);

      case "DELETE":
        const { id: deleteId } = z
          .object({ id: z.object({ id: z.array(z.string()) }) })
          .parse(req.query);
        const deletedExpert = await prisma.expert.delete({
          where: { id: deleteId.id[0] },
        });

        return res.status(200).json(deletedExpert);
      
    }
  } catch (error) {
    return res.status(400).json({
      message: "Invalid request body",
    });
  }
}
