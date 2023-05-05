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
import ExpertPicker from "~/components/chatbox/ExpertPicker";

const Chats: NextPage = () => {
    return (
        <>
            <Head>
                <title>Chat With Docs - Experts</title>
                <meta name="description" content="Chatting with your docs" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="mt-8 pt-navigation-height text-off-white">
                <Chatbox>
                    <ChatboxSidebar>Sidebar</ChatboxSidebar>
                    <ChatboxBody>
                        <ChatboxHeader>
                            <ExpertPicker />
                        </ChatboxHeader>
                        <ChatboxChat>Chat</ChatboxChat>
                        <ChatboxFooter>Footer</ChatboxFooter>
                    </ChatboxBody>
                </Chatbox>
            </main>
        </>
    );
};

export default Chats;
