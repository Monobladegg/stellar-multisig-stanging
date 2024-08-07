"use client";

import PublicNet from "./publicnet";
import StellarSdk from "stellar-sdk";
import { MainLayout } from "@/widgets";
import React, { FC, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Page: FC = () => {
    const [isValidId, setIsValidId] = useState<boolean | null>(null);
    const params = useSearchParams();
    const id = params?.get("id");

    useEffect(() => {
        if (id) {
            setIsValidId(StellarSdk.StrKey.isValidEd25519PublicKey(id));
        }
    }, [id]);

    if (!id || isValidId === null) {
        return (
            <Suspense>
                <MainLayout>
                    <center>
                        <h1>Loading...</h1>
                    </center>
                </MainLayout>
            </Suspense>
        );
    }

    if (!id || isValidId === false) {
        return (
            <Suspense>
                <MainLayout>
                    <div className="container">
                        <div
                            className="search error container narrow"
                            style={{ padding: "20px" }}
                        >
                            <h2 className="text-overflow">
                                Search results for {id}
                            </h2>
                            <div>User ID not found or invalid.</div>
                        </div>
                    </div>
                </MainLayout>
            </Suspense>
        );
    }

    return (
        <Suspense>
            <PublicNet id={id as string} />
        </Suspense>
    );
};

export default Page;
