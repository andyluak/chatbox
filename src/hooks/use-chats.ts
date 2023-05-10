import { type Chat } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { type ChatBodySchema } from "~/pages/api/chat/new-chat";
import { type ChatWithMessages } from "~/types";

export function useGetChats<T>() {
    const {
        data: chats = [],
        isLoading,
        error,
    } = useQuery<T[], Error>(["chats"], async () => {
        const res = await fetch("/api/chat/get-chats");
        const chats = (await res.json()) as T[];
        return chats;
    });

    return { chats, isLoading, error };
}

export function useCreateChat() {
    const queryClient = useQueryClient();

    return useMutation(
        async (data: ChatBodySchema) => {
            let url = "/api/chat/new-chat";

            if (data.data.chatId) {
                url = `/api/chat/${data.data.chatId}`;
            }

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            try {
                const newChat = (await res.json()) as ChatWithMessages;
                return newChat;
            } catch (error) {
                console.error(error);
            }
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["chats"]);
            },
            onMutate(variables) {
                const previousChats = queryClient.getQueryData<
                    ChatWithMessages[]
                >(["chats"]);

                if (variables.data.chatId) {
                    const updatedChat = previousChats?.find(
                        (chat) => chat.id === variables.data.chatId
                    );
                    if (updatedChat) {
                        updatedChat.messages.push({
                            id: "temp-id",
                            text: variables.data.prompt,
                            type: "Human",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            chatId: variables.data.chatId,
                        });

                        queryClient.setQueryData<ChatWithMessages[]>(
                            ["chats"],
                            (old) => {
                                if (old) {
                                    return [
                                        ...old.filter(
                                            (chat) =>
                                                chat.id !==
                                                variables.data.chatId
                                        ),
                                        updatedChat,
                                    ];
                                }
                            }
                        );
                    }

                    return;
                }

                const newChat: ChatWithMessages = {
                    id: "temp-id",
                    messages: [
                        {
                            id: "temp-id",
                            text: variables.data.prompt,
                            type: "Human",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            chatId: "temp-id",
                        },
                    ],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                queryClient.setQueryData<ChatWithMessages[]>(
                    ["chats"],
                    (old) => {
                        if (old) {
                            return [...old, newChat];
                        }
                    }
                );
            },
        }
    );
}
