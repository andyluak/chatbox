import { type Message } from "@prisma/client";
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
} from "langchain/prompts";
import {
    AIChatMessage,
    HumanChatMessage,
    SystemChatMessage,
} from "langchain/schema";
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
        userFormSubmission: z.record(z.string()).optional(),
        expertTemplate: z.object({
            id: z.string(),
            prompt: z.string(),
            variables: z.array(z.string()).optional(),
        }),
    }),
});

type ZExpert = z.infer<typeof chatBodySchema>["data"]["expertTemplate"];

type BuilderChatPromptTemplate = {
    expertTemplate: ZExpert;
    systemMessage?: string;
    prompt: string;
};

const buildChatPromptTemplate = ({
    expertTemplate,
    systemMessage,
    prompt,
}: BuilderChatPromptTemplate) => {
    if (systemMessage) {
        return ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(systemMessage),
            HumanMessagePromptTemplate.fromTemplate(
                expertTemplate.prompt ? expertTemplate.prompt : prompt
            ),
        ]);
    }
    return ChatPromptTemplate.fromPromptMessages([
        HumanMessagePromptTemplate.fromTemplate(prompt),
    ]);
};

const convertMessagesToLangChainFormat = (
    messages: Message[]
): (HumanChatMessage | AIChatMessage | SystemChatMessage)[] => {
    if (!messages) {
        return [];
    }

    return messages.map((message) => {
        if (message.type === "Human") {
            return new HumanChatMessage(message.text);
        } else if (message.type === "AI") {
            return new AIChatMessage(message.text);
        } else if (message.type === "System") {
            return new SystemChatMessage(message.text);
        } else {
            throw new Error("Unknown message type");
        }
    });
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        switch (req.method) {
            case "POST":
                // we will need to get the prompt to add it fromTemplate
                const { data } = chatBodySchema.parse(req.body);
                const { id } = z
                    .object({ id: z.array(z.string()) })
                    .parse(req.query);
                // we need to determine if this is an existing chat or a new one
                const chatHistory = await prisma.chat.findUnique({
                    where: {
                        id: id[0],
                    },
                    select: {
                        messages: true,
                    },
                });
                // have the template
                const promptTemplate = buildChatPromptTemplate({
                    expertTemplate: data.expertTemplate,
                    systemMessage: data.systemMessage,
                    prompt: data.expertTemplate.prompt,
                });

                const pastMessages = convertMessagesToLangChainFormat(
                    chatHistory?.messages ? chatHistory.messages : []
                );

                // we need to get the past messages
                const memory = new BufferMemory({
                    chatHistory: new ChatMessageHistory(pastMessages),
                });

                const chain = new ConversationChain({
                    memory,
                    prompt: promptTemplate,
                    llm: chat,
                });

                const response = (await chain.call({
                    text: "Hello",
                })) as AIChatMessage;

                // we need to save the response to the database
                const newMessage = await prisma.message.create({
                    data: {
                        text: response.text,
                        type: "AI",
                        chat: {
                            connect: {
                                id: id[0],
                            },
                        },
                    },
                });

                return res.status(200).json({
                    message: newMessage,
                });
        }
    } catch (error) {
        return res.status(400).json({
            message: "Invalid request body",
        });
    }
}
