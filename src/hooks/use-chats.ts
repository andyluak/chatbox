import { type Chat } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { type ChatBodySchema } from "~/pages/api/chat/new-chat";

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
            const res = await fetch("/api/chat/new-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            try {
                const newChat = (await res.json()) as Chat;
                return newChat;
            } catch (error) {
                console.error(error);
            }
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["chats"]);
            },
        }
    );
}
