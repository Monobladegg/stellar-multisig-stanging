// app/public/[id]/page.js

import axios from 'axios';
import MainLayout from "@/components/layouts";
import ClientComponent from "./ClientComponent";
import PublicNet from './publicnet';

// Секция для серверной логики
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

export async function generateStaticParams() {
    // Пример данных, которые вы можете получить из API или базы данных
    const accounts = await getAccountIds();
    return accounts.map(account => ({ id: account.address }));
}
//

// Компонент страницы
const Page = ({ params }) => {

    const {id} = params

    return (
        <MainLayout>
            {id  ?(
                <PublicNet id={id} />
            ) : (
                <div>Loading...</div>
            )}
        </MainLayout>
    );
};

export default Page;