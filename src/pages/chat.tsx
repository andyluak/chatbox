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

const Chats: NextPage = () => {
    return (
        <>
            <Head>
                <title>Chat With Docs - Experts</title>
                <meta name="description" content="Chatting with your docs" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="pt-navigation-height text-off-white">
                <Chatbox>
                    <ChatboxSidebar>Sidebar</ChatboxSidebar>
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
