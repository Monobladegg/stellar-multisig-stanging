"use client";

import axios from "axios";
import PublicNet from "./publicnet";
import StellarSdk from "stellar-sdk";
import MainLayout from "@/components/layouts";

export async function getStaticPaths() {
    const accounts = await getAccountIds();
    const paths = accounts.map((account) => ({
        params: { id: account.id },
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    return {
        props: {
            id: params.id,
        },
    };
}

export default function Page({ id }) {
    if (!StellarSdk.StrKey.isValidEd25519PublicKey(id)) {
        return (
            <MainLayout>
                <div className="container">
                    <div
                        className={`search error container narrow`}
                        style={{ padding: "20px" }}
                    >
                        <h2 className="text-overflow">
                            Search results for {id}
                        </h2>
                        <div>User ID not found or invalid.</div>
                    </div>
                </div>
            </MainLayout>
        );
    }
    return <PublicNet id={id} />;
}

const getAccountIds = async () => {
    const apiStellarURI =
        "https://api.stellar.expert/explorer/directory?limit=20";
    try {
        const response = await axios.get(apiStellarURI);
        const accounts = response.data._embedded.records;
        return accounts.map((account) => ({ id: account.address }));
    } catch (error) {
        console.error("Error fetching accounts from Stellar Expert:", error);
        return [];
    }
};
