import { type NextPage } from "next";
import Head from "next/head";

import Container from "~/components/container";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Chat With Docs</title>
                <meta name="description" content="Chatting with your docs" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="pt-navigation-height">
                <Container className="pt-12 md:pt-20 lg:pt-36"></Container>
            </main>
        </>
    );
};

export default Home;
