import clsx from "clsx";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import ExpertCreator from "~/components/ExpertCreator";

import Container from "~/components/container";
import { TypographyH1, TypographyLead } from "~/components/ui/Typography";
import { Button } from "~/components/ui/button";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chat With Docs</title>
        <meta name="description" content="Chatting with your docs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="fixed left-0 top-0 z-10 w-full text-white backdrop-blur-[12px]">
        <Container className="flex h-navigation-height items-center">
          <Link className="mr-8 text-lg" href="/">
            Chatbox
          </Link>
          <nav
            className={clsx(
              "top-navigation-height overflow-auto rounded-lg bg-background bg-navigation-gradient transition-opacity duration-500",
              "px-4 md:relative md:top-0 md:block md:h-auto md:w-auto md:translate-x-0 md:overflow-hidden md:bg-transparent md:opacity-100 md:transition-none"
            )}
          >
            <ul
              className={clsx(
                "flex items-center",
                "[&_li:not(:last-child)]:mr-4 [&_li]:cursor-pointer [&_li]:transition-colors hover:[&_li]:text-off-white"
              )}
            >
              <li>Home</li>
              <li>About</li>
              <li>Chats</li>
              <li>
                <Button variant="ghost" size="lg" textsize="xl">
                  Sign In
                </Button>
              </li>
            </ul>
          </nav>
        </Container>
      </header>
      <main className="pt-navigation-height">
        <Container className="pt-12 md:pt-20 lg:pt-36">
          <TypographyH1>Expert Designer</TypographyH1>
          <TypographyLead className="max-w-3xl">
            Here you can configure the types of helpers you want to create
          </TypographyLead>
          <ExpertCreator />
        </Container>
      </main>
    </>
  );
};

export default Home;
