import { Chat } from "@prisma/client";
import { useAtom } from "jotai";
import { type NextPage } from "next";
import Head from "next/head";

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

const Chats: NextPage = () => {
    const { chats } = useGetChats<Chat>();
    const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom)

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
                                    variant={selectedChat === chat.id ? "default" : "outline"}
                                    size="sm"
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat.id)}
                                    
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
                            <SystemMessageInserter />
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
