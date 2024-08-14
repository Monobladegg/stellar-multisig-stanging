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

const accountItem: FC<Props> = ({ id, isOpenAccount, setIsOpenAccount }) => {
  const { net, theme, accounts } = useStore(
    useShallow(state => state)
  );

  const handleAccount = () => {
    setIsOpenAccount(!isOpenAccount);
    const currentAccount = accounts.find((account) => account.isCurrent === true);
    const selectedAccount = accounts.find((account) => String(account.accountID) === String(id));
    if (currentAccount) currentAccount.isCurrent = false;
    if (selectedAccount) selectedAccount.isCurrent = true;
  };
  
  return (
    <li className={
      theme === "night"
        ? `dropdown-item ${net === "testnet" && "selected"}`
        : `dropdown-item-light ${
            net === "testnet" && "selected"
          }`
    } style={{textAlign: "center"}} onClick={handleAccount}>
      <Link href={`/${net}/account?id=${id}`}>{collapseAccount(id)}</Link>
    </li>
  );
};

export default accountItem;