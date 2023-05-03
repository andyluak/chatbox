import { type NextPage } from "next";
import Head from "next/head";

import ExpertCreator from "~/components/experts/ExpertCreator";
import Container from "~/components/container";
import { TypographyH1, TypographyLead } from "~/components/ui/Typography";
import ExpertList from "~/components/experts/ExpertList";

const Experts: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chat With Docs - Experts</title>
        <meta name="description" content="Chatting with your docs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="pt-navigation-height">
        <Container className="pt-12 md:pt-20 lg:pt-36">
          <TypographyH1>Expert Designer</TypographyH1>
          <TypographyLead className="max-w-3xl">
            Here you can configure the types of helpers you want to create
          </TypographyLead>
          <ExpertCreator />
          <ExpertList />
        </Container>
      </main>
    </>
  );
};

export default Experts;
