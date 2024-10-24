"use client";

import { FC, useEffect, useState } from "react";
import { useStore } from "@/shared/store";
import { Footer, Header } from "@/widgets";
import { useShallow } from "zustand/react/shallow";
import { usePathname } from "next/navigation";
import { PopupVersionTheSite } from "@/widgets/shared/ui/PopupVersionTheSite";
import axios from "axios";
import { cacheConfig } from "@/shared/configs";
import Modals from "@/widgets/Layout/Modals";

type Props = {
  children: React.ReactNode;
};

const PageLayout: FC<Props> = ({ children }) => {
  const [isWindowDefined, setIsWindowDefined] = useState<boolean>(false);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
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
    initializeFirebase,
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
    let intervalId: ReturnType<typeof setInterval> | null = null;

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

        if (latestHash !== process.env.NEXT_PUBLIC_COMMIT_HASH) {
          console.log("Version changed");
          if (timeoutId) clearTimeout(timeoutId);

          timeoutId = setTimeout(() => {
            setShowPopup(true);
          }, 60000);
        }
      } catch (error) {
        console.error("Error fetching commit hash:", error);
      }
    };

    const startPolling = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(
        fetchLatestCommitHash,
        cacheConfig.checkOfCurrentVersionDurationMs
      );
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchLatestCommitHash(); // Мгновенная проверка при возврате на вкладку
        startPolling(); // Запуск интервала
      } else {
        stopPolling(); // Остановка интервала при уходе с вкладки
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Запуск проверки и интервала при первой загрузке
    fetchLatestCommitHash();
    startPolling();

    // Очистка ресурсов при размонтировании компонента
    return () => {
      stopPolling(); // Остановка интервала
      document.removeEventListener("visibilitychange", handleVisibilityChange); // Удаление обработчика
    };
  }, []);

  useEffect(() => {
    window.localStorage.getItem("Firebase-currentFirebase") === "Default"
      ? initializeFirebase({
          apiKey: process.env.NEXT_PUBLIC_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_APP_ID,
          measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
        })
      : initializeFirebase({
          apiKey: window.localStorage.getItem("Firebase-apiKey")!,
          authDomain: window.localStorage.getItem("Firebase-authDomain")!,
          projectId: window.localStorage.getItem("Firebase-projectId")!,
          storageBucket: window.localStorage.getItem("Firebase-storageBucket")!,
          messagingSenderId: window.localStorage.getItem(
            "Firebase-messagingSenderId"
          )!,
          appId: window.localStorage.getItem("Firebase-appId")!,
          measurementId: window.localStorage.getItem("Firebase-measurementId")!,
        });
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
        {showPopup && <PopupVersionTheSite />}
        <Modals />
      </body>
    </html>
  );
};

export default PageLayout;
