import React, { FC, Suspense } from "react";
import Account from "@/pages/account/main";

const Page: FC = () => (
    <Suspense>
        <Account />
    </Suspense>
);
export default Page;
