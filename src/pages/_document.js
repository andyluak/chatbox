import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en" className="dark bg-primary-gradient min-h-screen">
            <Head />
            <body style={{marginRight: "0!important"}}>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
