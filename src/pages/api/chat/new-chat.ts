import { type Message } from "@prisma/client";
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
} from "langchain/prompts";
import { type AIChatMessage, type ChainValues } from "langchain/schema";
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
        prompt: z.string().optional(),
    }),
});

type ZExpert = z.infer<typeof chatBodySchema>["data"]["expertTemplate"];
type ZUserFormSubmission = z.infer<
    typeof chatBodySchema
>["data"]["userFormSubmission"];

type BuilderChatPromptTemplate = {
    expertTemplate: ZExpert;
    systemMessage?: string;
};

const buildChatPromptTemplate = ({
    expertTemplate,
    systemMessage,
}: BuilderChatPromptTemplate) => {
    if (systemMessage) {
        return ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(systemMessage),
            HumanMessagePromptTemplate.fromTemplate(
                expertTemplate.prompt ? expertTemplate.prompt : "{prompt}"
            ),
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
    AIMessage: AIChatMessage;
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
        text: AIMessage.text,
        type: "AI",
    });
    return messages;
};

const convertExpertTemplateToPrompt = (
    expertTemplate: ZExpert,
    userFormSubmission: ZUserFormSubmission,
    prompt: string
) => {
    type MyAcc = {
        [key: string]: string;
    };
    if (!userFormSubmission || !expertTemplate) return prompt;

    // we need to return an object of the shape { variable: value }

    const variables = expertTemplate.variables;
    const variableValues = Object.values(userFormSubmission);

    if (!variables || !variableValues) return prompt;

    const variableValueMap = variables.reduce(
        (acc: MyAcc, variable: keyof MyAcc) => {
            const value =
                userFormSubmission[variable]?.replace(`{${variable}}`, "/g") ??
                "";
            acc[variable] = value;
            return acc;
        },
        {}
    );

    return variableValueMap;
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
                    expertTemplate: data.expertTemplate,
                    systemMessage: data.systemMessage,
                });
                // create chain
                const chain = new ConversationChain({
                    prompt: promptTemplate,
                    llm: chat,
                });

                // create chain call data
                const chainCallData = convertExpertTemplateToPrompt(
                    data.expertTemplate,
                    data.userFormSubmission,
                    data.prompt ?? ""
                );

                // call chain
                const response = (await chain.call(
                    chainCallData as ChainValues
                )) as AIChatMessage;

                // save chat
                const newChat = await prisma.chat.create({
                    data: {
                        messages: {
                            createMany: {
                                data: getMessagesToSave({
                                    prompt: data.prompt || "",
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
