import clsx from "clsx";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import Container from "~/components/container";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chat With Docs</title>
        <meta name="description" content="Chatting with your docs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="fixed left-0 top-0 z-10 w-full text-off-white backdrop-blur-[12px]">
        <Container className="flex items-center h-navigation-height">
          <Link className="text-lg mr-8" href="/">Chatbox</Link>
          <nav
            className={clsx(
              "bg-background fixed left-0 top-navigation-height h-[calc(100vh_-_var(--navigation-height))] w-full overflow-auto transition-opacity duration-500",
              "md:relative md:top-0 md:block md:h-auto md:w-auto md:translate-x-0 md:overflow-hidden md:bg-transparent md:opacity-100 md:transition-none"
            )}
          >
            <ul className="flex [&_li]:mr-4 hover:[&_li]:text-gray-800">
              <li>Home</li>
              <li>About</li>
              <li>Chats</li>
              <li>
                <button>Sign In</button>
              </li>
            </ul>
          </nav>
        </Container>
      </header>
    </>
  );
};

export default Home;
