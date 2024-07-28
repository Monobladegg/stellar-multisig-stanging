import MainLayout from "@/components/layouts";
import PublicNet from "./publicnet";

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
