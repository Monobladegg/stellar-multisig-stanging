import { FC } from "react";
import Link from "next/link";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";
import { collapseAccount } from "@/pages/public/account/publicnet";

interface Props {
  id: string;
  isOpenAccount: boolean;
  setIsOpenAccount: (isOpenAccount: boolean) => void;
}

const AccountItem: FC<Props> = ({ id, isOpenAccount, setIsOpenAccount }) => {
  const { net, theme, accounts, setAccounts } = useStore(
    useShallow((state) => ({
      net: state.net,
      theme: state.theme,
      accounts: state.accounts,
      setAccounts: state.setAccounts,
    }))
  );

  const handleAccount = () => {
    setIsOpenAccount(!isOpenAccount);

    // Обновляем аккаунты только если они находятся на одном и том же 'net'
    const updatedAccounts = accounts.map(
      (account) =>
        account.net === net
          ? account.accountID === id
            ? { ...account, isCurrent: true }
            : { ...account, isCurrent: false }
          : account // Не трогаем аккаунты с другим 'net'
    );

    setAccounts(updatedAccounts);
  };

  return (
    <Link href={`/${net}/account?id=${id}`}>
      <li
        className={
          theme === "night"
            ? `dropdown-item ${net === "testnet" && "selected"}`
            : `dropdown-item-light ${net === "testnet" && "selected"}`
        }
        style={{ textAlign: "center" }}
        onClick={handleAccount}
      >
        {collapseAccount(id)}
      </li>
    </Link>
  );
};

export default AccountItem;
