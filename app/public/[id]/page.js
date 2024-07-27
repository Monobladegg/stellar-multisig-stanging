// app/public/[id]/page.js

// Компонент страницы
import MainLayout from "@/components/layouts";
import ClientComponent from "./ClientComponent";

const Page = ({ params }) => {
    return (
        <MainLayout>
            <ClientComponent params={params} />
        </MainLayout>
    );
};

export default Page;
