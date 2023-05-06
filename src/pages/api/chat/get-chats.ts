import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "~/server/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        switch (req.method) {
            case "GET":
                const chats = await prisma.chat.findMany({
                    include: {
                        messages: true,
                    },
                });
                return res.status(200).json(chats);
        }
    } catch (error) {
        return res.status(400).json({
            message: "Invalid request body",
        });
    }
}
