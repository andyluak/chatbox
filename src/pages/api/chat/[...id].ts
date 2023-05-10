import { type Message } from "@prisma/client";
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
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
        prompt: z.string().nonempty(),
    }),
});

type BuilderChatPromptTemplate = {
    systemMessage?: string;
};

const buildChatPromptTemplate = ({
    systemMessage,
}: BuilderChatPromptTemplate) => {
    if (systemMessage) {
        return ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(systemMessage),
            new MessagesPlaceholder("history"),
            HumanMessagePromptTemplate.fromTemplate("{prompt}"),
        ]);
    }
    return ChatPromptTemplate.fromPromptMessages([
        new MessagesPlaceholder("history"),
        HumanMessagePromptTemplate.fromTemplate("{prompt}"),
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

type UnsavedMessages = Pick<Message, "text" | "type">;

const getMessagesToSave = ({
    prompt,
    AIMessage,
}: {
    prompt: string;
    systemMessage?: string;
    AIMessage: {
        response: string;
    };
}) => {
    const messages: UnsavedMessages[] = [];
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
                    systemMessage: data.systemMessage,
                });

                const pastMessages = convertMessagesToLangChainFormat(
                    chatHistory?.messages ? chatHistory.messages : []
                );

                // we need to get the past messages
                const memory = new BufferMemory({
                    chatHistory: new ChatMessageHistory(pastMessages),
                    returnMessages: true,
                    memoryKey: "history",
                });

                const chain = new ConversationChain({
                    memory: memory,
                    prompt: promptTemplate,
                    llm: chat,
                });

                const response = (await chain.call({
                    prompt: data.prompt,
                })) as {
                    response: string;
                };

                // we need to save the response to the database
                const updatedChat = await prisma.chat.update({
                    where: { id: id[0] },
                    data: {
                        messages: {
                            create: getMessagesToSave({
                                prompt: "Hello",
                                AIMessage: response,
                            }),
                        },
                    },
                });

                return res.status(200).json(updatedChat);
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Invalid request body",
        });
    }
}
