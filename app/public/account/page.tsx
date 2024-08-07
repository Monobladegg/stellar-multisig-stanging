import React, { FC, Suspense } from "react";
import Account from "@/pages/public/account/account";
import { MainLayout } from "@/widgets";

const Page: FC = () => (
    <Suspense
        fallback={
            <MainLayout>
                <center>
                    <h1>Loading...</h1>
                </center>
            </MainLayout>
        }
    >
        <Account />
    </Suspense>
);
export default Page;
