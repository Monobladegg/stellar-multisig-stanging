import Assets from "@/pages/public/assets/page";
import { Metadata } from "next";
import { FC } from "react";

export const metadata: Metadata = {
    title: "Assets",
    description: "Assets of the Stellar network",
};

const Page: FC = () => <Assets />;

export default Page;
