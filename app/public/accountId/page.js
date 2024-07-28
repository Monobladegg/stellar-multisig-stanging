// pages/public/accountId/[id].js
"use client";

import MainLayout from "@/components/layouts";
import PublicNet from "./publicnet";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Page = () => {

    const [href, setHref] = useState("");
    useEffect(() => {
        setHref(window.location.href);
    }, []);
    console.log(href);

    const id = href.split("id=").pop();
    console.log(id)

    return (
        // <MainLayout>
        //     {id ? <PublicNet id={id} /> : <p>Loading...</p>}
        // </MainLayout>
        123
    );
};

export default Page;
