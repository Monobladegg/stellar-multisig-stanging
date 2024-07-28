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

export async function getStaticPaths() {
    const accounts = await getAccountIds();
    const paths = accounts.map(account => ({
        params: { id: account.address }
    }));

    return {
        paths,
        fallback: false
    };
}

export async function getStaticProps({ params }) {
    const { id } = params;
    // Вы можете здесь добавить дополнительную логику для получения данных на основе ID

    return {
        props: { id }, // Передаем ID в компонент
    };
}

const Page = ({ id }) => {
    return (
        <MainLayout>
            <PublicNet id={id} />
        </MainLayout>
    );
};

export default Page;
