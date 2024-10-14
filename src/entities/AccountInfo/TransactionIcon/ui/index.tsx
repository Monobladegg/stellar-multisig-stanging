import { useStore } from "@/shared/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { FC } from "react";
import { useShallow } from "zustand/react/shallow";

interface Props {
  isVisible: boolean;
  typeIcon: "Add" | "Change";
  ID: string;
  typeOp?: string;
  style?: React.CSSProperties;
}

const TransactionIcon: FC<Props> = ({ isVisible, typeIcon, ID, typeOp, style }) => {
  const { net } = useStore(useShallow((state) => state));

  if (!isVisible) return null;

  return (
    <Link
      style={style}
      href={`/${net}/build-transaction?sourceAccount=${ID}&typeOperation=${typeOp}`}
    >
      <i
        title={typeIcon}
        className={typeIcon === "Change" ? "fas fa-edit" : "fa-solid fa-plus"}
      ></i>{" "}
    </Link>
  );
};

export default TransactionIcon;
