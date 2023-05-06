import { type Chat, type Message } from "@prisma/client";

export interface ChatWithMessages extends Chat {
    messages: Message[];
}