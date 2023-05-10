import { type Message } from "@prisma/client";
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
} from "langchain/prompts";
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

import { prisma } from "~/server/db";

const chat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    streaming: true,
    callbacks: [
        {
            handleLLMNewToken(token: string) {
                process.stdout.write(token);
            },
        },
    ],
});

const chatBodySchema = z.object({
    data: z.object({
        systemMessage: z.string().optional(),
        prompt: z.string(),
        chatId: z.string().optional(),
    }),
});

export type ChatBodySchema = z.infer<typeof chatBodySchema>;

type BuilderChatPromptTemplate = {
    systemMessage?: string;
};

const buildChatPromptTemplate = ({
    systemMessage,
}: BuilderChatPromptTemplate) => {
    if (systemMessage) {
        return ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(systemMessage),
            HumanMessagePromptTemplate.fromTemplate("{prompt}"),
        ]);
    }
    return ChatPromptTemplate.fromPromptMessages([
        HumanMessagePromptTemplate.fromTemplate("{prompt}"),
    ]);
};

type UnsavedMessages = Pick<Message, "text" | "type">;

const getMessagesToSave = ({
    prompt,
    systemMessage,
    AIMessage,
}: {
    prompt: string;
    systemMessage?: string;
    AIMessage: {
        response: string;
    };
}) => {
    const messages: UnsavedMessages[] = [];
    if (systemMessage) {
        messages.push({
            text: systemMessage,
            type: "System",
        });
    }

    messages.push({
        text: prompt,
        type: "Human",
    });

    messages.push({
        text: AIMessage.response,
        type: "AI",
    });
    return messages;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        switch (req.method) {
            case "POST":
                // parse schema
                const { data } = chatBodySchema.parse(req.body);
                // build prompt template
                const promptTemplate = buildChatPromptTemplate({
                    systemMessage: data.systemMessage,
                });
                // create chain
                const chain = new ConversationChain({
                    prompt: promptTemplate,
                    llm: chat,
                });

                // call chain
                const response = (await chain.call({
                    prompt: data.prompt,
                })) as {
                    response: string;
                };
                // save chat
                const newChat = await prisma.chat.create({
                    data: {
                        messages: {
                            createMany: {
                                data: getMessagesToSave({
                                    prompt: data.prompt,
                                    systemMessage: data.systemMessage,
                                    AIMessage: response,
                                }),
                            },
                        },
                    },
                    include: {
                        messages: true,
                    },
                });

                // return chat
                return res.status(200).json(newChat);
        }
    } catch (error) {
        return res.status(400).json({
            message: "Invalid request body",
        });
    }
}
