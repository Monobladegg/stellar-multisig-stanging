// app/public/[id].js

import axios from "axios";
import PublicNet from "./publicnet";

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

export async function generateStaticParams() {
    const accounts = await getAccountIds();
    const params = accounts.map((account) => ({ id: account.id }));
    return params;
}

export default function Page({params}) {
    return <PublicNet id={params.id} />;
}

// const fetcher = (...args) => fetch(...args).then((res) => res.json());

// function Content({ id }) {
//     const { data, error } = useSWR([`https://horizon.stellar.org/accounts/${id}`], fetcher);
//     if (error) return <div>Failed to load</div>;
//     if (!data) return <div>Loading...</div>;
//     return <PublicNet id={id} />;
// }
