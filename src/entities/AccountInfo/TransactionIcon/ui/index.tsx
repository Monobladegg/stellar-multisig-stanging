import { useStore } from "@/shared/store";
import Link from "next/link";
import React, { FC } from "react";
import { useShallow } from "zustand/react/shallow";

interface Props {
  isVisible: boolean;
  typeIcon: "Add" | "Change";
  ID: string;
  typeOp?: string;
  style?: React.CSSProperties;
  processedKey?: string;
  processedValue?: string | JSX.Element;
}

const TransactionIcon: FC<Props> = ({
  isVisible,
  typeIcon,
  ID,
  typeOp,
  style,
  processedKey,
  processedValue,
}) => {
  const { net } = useStore(useShallow((state) => state));

  if (!isVisible) return null;

  return (
    <Link
      style={style}
      href={`/${net}/build-transaction?sourceAccount=${ID}${
        typeOp && `&typeOperation=${typeOp}`
      }${
        processedKey &&
        processedValue &&
        `&processedKey=${processedKey}&processedValue=${processedValue}`
      }`}
    >
      <i
        title={typeIcon}
        className={typeIcon === "Change" ? "fas fa-edit" : "fa-solid fa-plus"}
      ></i>{" "}
    </Link>
  );
};

export default TransactionIcon;
