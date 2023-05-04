import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import Navbar from "~/components/Navbar";
import { TypographyLead } from "~/components/ui/Typography";
import "~/styles/globals.css";

const queryClient = new QueryClient();

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider session={session}>
                <Navbar />
                <Component {...pageProps} />
                <div className="mt-16 flex h-96 items-center justify-center border-t border-t-slate-300">
                    <TypographyLead>Footer</TypographyLead>
                </div>
            </SessionProvider>
        </QueryClientProvider>
    );
};

export default MyApp;
