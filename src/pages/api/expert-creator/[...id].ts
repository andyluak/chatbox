import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

import { expertBodySchemaOptional } from ".";
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

            case "PUT":
                const { data: dataOptional } = expertBodySchemaOptional.parse(
                    req.body
                );
                console.log(dataOptional);
                const { id: updateId } = z
                    .object({ id: z.array(z.string()) })
                    .parse(req.query);

                const updatedExpert = await prisma.expert.update({
                    where: { id: updateId[0] },
                    data: dataOptional,
                });

                return res.status(200).json(updatedExpert);
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Invalid request body",
        });
    }
}
