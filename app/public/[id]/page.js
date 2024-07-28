// app/public/[id]/page.js

import axios from 'axios';
import MainLayout from "@/components/layouts";
import PublicNet from './publicnet';

// Функция для получения данных
const getAccountIds = async () => {
    const apiStellarURI = "https://api.stellar.expert/explorer/directory?limit=20";
    try {
        const response = await axios.get(apiStellarURI);
        const accounts = response.data._embedded.records;
        console.log(accounts);
        return accounts;
    } catch (error) {
        console.error("Error fetching accounts from Stellar Expert:", error);
        return [];
    }
};

// Компонент страницы
const Page = async ({ params }) => {
    const { id } = params;
    
    // Здесь вы можете выполнить любой запрос данных
    // Например, получить информацию о конкретном аккаунте по ID
    // const accountData = await axios.get(`API_URL/${id}`);

    return (
        <MainLayout>
            <PublicNet id={id} />
        </MainLayout>
    );
};

export async function generateStaticParams() {
    const accounts = await getAccountIds();
    return accounts.map(account => ({ id: account.address }));
}

export default Page;
