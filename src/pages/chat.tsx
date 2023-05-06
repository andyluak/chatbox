import { type Message } from "@prisma/client";
import { useAtom } from "jotai";
import { type NextPage } from "next";
import Head from "next/head";

import ChatMessage from "~/components/chatbox/ChatMessage";
import {
    Chatbox,
    ChatboxBody,
    ChatboxChat,
    ChatboxFooter,
    ChatboxHeader,
    ChatboxSidebar,
} from "~/components/chatbox/Chatbox";
import ChatboxMessageForm from "~/components/chatbox/ChatboxMessageForm";
import ExpertPicker from "~/components/chatbox/ExpertPicker";
import SystemMessageInserter from "~/components/chatbox/SystemMessageInserter";
import { Button } from "~/components/ui/button";
import { useGetChats } from "~/hooks/use-chats";
import { selectedChatAtom } from "~/store/chatbox";
import { type ChatWithMessages } from "~/types";

const Chats: NextPage = () => {
    const { chats } = useGetChats<ChatWithMessages>();
    const [selectedChatId, setSelectedChatId] = useAtom(selectedChatAtom);
    const selectedChat = chats.find((chat) => chat.id === selectedChatId);

    return (
        <>
            <Head>
                <title>Chat With Docs - Experts</title>
                <meta name="description" content="Chatting with your docs" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="pt-navigation-height text-off-white">
                <Chatbox>
                    <ChatboxSidebar>
                        <div className="my-4 flex flex-col">
                            <Button>New Chat</Button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {chats.map((chat) => (
                                <Button
                                    variant={
                                        selectedChatId === chat.id
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    key={chat.id}
                                    onClick={() => setSelectedChatId(chat.id)}
                                >
                                    {chat.id}
                                </Button>
                            ))}
                        </div>
                    </ChatboxSidebar>
                    <ChatboxBody>
                        <ChatboxHeader>
                            <ExpertPicker />
                        </ChatboxHeader>
                        <ChatboxChat>
                            {selectedChat ? (
                                <div className="flex flex-col gap-4">
                                    {selectedChat.messages.map(
                                        (message: Message) => (
                                            <ChatMessage
                                                key={message.id}
                                                type={message.type}
                                                text={message.text}
                                            />
                                        )
                                    )}
                                </div>
                            ) : (
                                <SystemMessageInserter />
                            )}
                        </ChatboxChat>
                        <ChatboxFooter>
                            <ChatboxMessageForm />
                        </ChatboxFooter>
                    </ChatboxBody>
                </Chatbox>
            </main>
        </>
    );
};

export default Chats;
