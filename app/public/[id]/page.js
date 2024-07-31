// pages/public/[id].js
import axios from "axios";
import PublicNet from "./publicnet"; // Adjust the import path as needed
import StellarSdk from "stellar-sdk";
import MainLayout from "@/components/layouts";

// Fetching account IDs using Stellar Expert API
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

// Function to generate static params
export async function generateStaticParams() {
    let accounts = await getAccountIds();
    
    // Manually add missing IDs if needed
    accounts.push({ id: 'GAEAAQ6GYMF6SSAWSW3MSLWB5LHYQIEGF3I3TUBJM6L3MSZYSPOMTLTH' });

    const params = accounts.map((account) => ({ id: account.id }));
    console.log('Generated Static Params:', params); // Debugging line
    return params;
}


// Page component
export default function Page({ params }) {
    if (!StellarSdk.StrKey.isValidEd25519PublicKey(params.id)) {
        return (
            <MainLayout>
                <div className="container">
                    <div className="search error container narrow" style={{ padding: "20px" }}>
                        <h2 className="text-overflow">Search results for {params.id}</h2>
                        <div>User ID not found or invalid.</div>
                    </div>
                </div>
            </MainLayout>
        );
    }
    return <PublicNet params={params} />;
}
