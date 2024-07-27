// app/public/[id]/page.js

// Секция для серверной логики
export async function generateStaticParams() {
    // Пример данных, которые вы можете получить из API или базы данных
    const staticAccountIds = ["GAEAAQ6GYMF6SSAWSW3MSLWB5LHYQIEGF3I3TUBJM6L3MSZYSPOMTLTH"];
    return staticAccountIds.map(id => ({ id }));
}

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
