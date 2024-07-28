// app/public/accountId?id=

"use client";

import MainLayout from "@/components/layouts";
import PublicNet from "./publicnet";

// Функция для получения данных
// const getAccountIds = async () => {
//     const apiStellarURI = "https://api.stellar.expert/explorer/directory?limit=20";
//     try {
//         const response = await axios.get(apiStellarURI);
//         const accounts = response.data._embedded.records;
//         console.log(accounts);
//         return accounts;
//     } catch (error) {
//         console.error("Error fetching accounts from Stellar Expert:", error);
//         return [];
//     }
// };

// Компонент страницы
const Page = () => {

    const url = window.location.href
    // http://localhost:3000/public/accountId?id=GAEAAQ6GYMF6SSAWSW3MSLWB5LHYQIEGF3I3TUBJM6L3MSZYSPOMTLTH
    const query = new URLSearchParams(url.split('?')[1]);
    const id = query.get('id');

    return (
        <MainLayout>
            <PublicNet id={id} />
        </MainLayout>
    );
};

// export async function generateStaticParams() {
//     const accounts = await getAccountIds();
//     return accounts.map(account => ({ id: account.address }));
// }

export default Page;
