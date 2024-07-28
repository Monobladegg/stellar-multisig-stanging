// pages/public/accountId/[id].js
"use client";

import MainLayout from "@/components/layouts";
import PublicNet from "./publicnet";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Page = () => {
    const [id, setId] = useState("");
    useEffect(() => {
        const href = window.location.href;
        setId(href.split("id=").pop());
    }, []);

    return (
        <MainLayout>
            {id ? <PublicNet id={id} /> : <p>Loading...</p>}
        </MainLayout>
    );
};

export default Page;
