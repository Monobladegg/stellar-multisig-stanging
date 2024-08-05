"use client"

import { FC } from "react";
import { useStore } from "@/features/store";
import { Footer } from "@/widgets";
import { Header } from "@/widgets";
import { useShallow } from "zustand/react/shallow";

type Props = {
    children: React.ReactNode;
};

const PageLayout: FC<Props> = ({ children }) => {
    const { theme } = useStore(
        useShallow((state) => ({
            theme: state.theme,
        }))
    );

    return (
        <html lang="en" data-theme={theme}>
            <body>
                <main className="flex min-h-screen flex-col">
                    <hr className="blue-ribbon" />
                    <Header />
                    {children}
                    <Footer />
                </main>
            </body>
        </html>
    );
};

export default PageLayout