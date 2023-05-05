import clsx from "clsx";
import Link from "next/link";

import Container from "./container";
import { Button } from "./ui/button";

const Navbar = () => {
    return (
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
                        <li>
                            <Link href="/experts">Experts</Link>
                        </li>
                        <li><Link href="/chat">Chat</Link></li>
                        <li>
                            <Button variant="ghost" size="lg" textsize="xl">
                                Sign In
                            </Button>
                        </li>
                    </ul>
                </nav>
            </Container>
        </header>
    );
};

export default Navbar;
