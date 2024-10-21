"use client";

import { FC, useEffect, useState } from "react";
import { useStore } from "@/shared/store";
import { Footer, Header } from "@/widgets";
import { useShallow } from "zustand/react/shallow";
import AddAccountModal from "@/widgets/shared/layouts/Header/ui/AddAccountModal";
import { usePathname } from "next/navigation";
import { PopupVersionTheSite } from "@/widgets/shared/ui/PopupVersionTheSite";
import axios from "axios";

type Props = {
  children: React.ReactNode;
};

const PageLayout: FC<Props> = ({ children }) => {
  const [isWindowDefined, setIsWindowDefined] = useState<boolean>(false);
  const [commitHash, setCommitHash] = useState(
    process.env.NEXT_PUBLIC_COMMIT_HASH ?? ""
  );
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const {
    theme,
    setTheme,
    setNet,
    setAccounts,
    accounts,
    isOpenAddAccountModal,
    setIsAuth,
    net,
    setServer,
    setNetwork,
  } = useStore(useShallow((state) => state));

  useEffect(() => {
    setIsWindowDefined(typeof window !== "undefined");
    if (isWindowDefined) {
      if (localStorage.getItem("theme")) {
        const theme = localStorage.getItem("theme")!;
        if (theme === "day" || theme === "night") {
          setTheme(theme);
        } else {
          console.error(`Invalid theme value: ${theme}`);
        }
      }

      const netValue = localStorage.getItem("net");
      if (netValue === "testnet" || netValue === "public") {
        setNet(netValue);
      }

      if (localStorage.getItem("accounts")) {
        setAccounts(JSON.parse(localStorage.getItem("accounts")!));
      }

      if (pathname) {
        setNet(pathname.includes("testnet") ? "testnet" : "public");
      }
    }
  }, [isWindowDefined, setTheme, setNet, setAccounts, pathname]);

  useEffect(() => {
    setIsAuth(
      accounts
        .filter((account) => account.net === net)
        .filter((account) => account.isCurrent).length > 0
    );
  }, [accounts, net, setIsAuth]);

  const themeLS: string | undefined | null = isWindowDefined
    ? window.localStorage.getItem("theme")
      ? window.localStorage.getItem("theme")
      : "night"
    : "";

  useEffect(() => {
    setServer(net);
    setNetwork(net);
  }, [net]);

  useEffect(() => {
    const fetchLatestCommitHash = async () => {
      try {
        const response = await axios.get(
          "https://api.github.com/repos/Monobladegg/stellar-multisig-stanging/commits",
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            },
          }
        );
        const latestHash = response.data[0].sha.substring(0, 7);
        setCommitHash(latestHash);
        console.log(latestHash);

        if (latestHash !== process.env.NEXT_PUBLIC_COMMIT_HASH) {
          setShowPopup(true);
        }
      } catch (error) {
        console.error("Ошибка при получении информации о последнем коммите:", error);
      }
    };
    fetchLatestCommitHash();

    const intervalId = setInterval(fetchLatestCommitHash, 10000);

    return () => clearInterval(intervalId);
  }, []);

  if (!isWindowDefined) {
    return (
      <html>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>MTL Stellar Multisig</title>
        </head>
        <body></body>
      </html>
    );
  }

  return (
    <html lang="en" data-theme={!theme || themeLS}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="commit-hash" content={commitHash} />
        <title>MTL Stellar Multisig</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />
      </head>
      <body>
        <main
          className={`flex min-h-screen flex-col ${
            isOpenAddAccountModal && "is-open-add-account-modal"
          }`}
        >
          <hr className="blue-ribbon" />
          <Header />
          {children}
          <Footer />
        </main>
        {isOpenAddAccountModal && <AddAccountModal />}
        {showPopup && <PopupVersionTheSite />}
      </body>
    </html>
  );
};

export default PageLayout;
