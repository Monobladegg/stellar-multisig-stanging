import { useStore } from "@/shared/store";
import React, { FC } from "react";
import { Transaction } from "stellar-sdk";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import { Net } from "@/shared/types/store/slices";
import { TransactionStatuses } from "@/views/account/AccountInfo";

interface Props {
  transaction: Transaction;
  seqNumsIsStale: boolean[];
  index: number;
  updatedTransactionSequence: (publicKey: string, net: Net) => void;
}

const InlineTransaction: FC<Props> = ({transaction, seqNumsIsStale, index, updatedTransactionSequence,}) => {
  const {net} = useStore(useShallow((state) => state));
  return (
    <tr>
      <td>
        <span style={{ display: "none" }}>
          {Buffer.from(transaction?.hash()).toString("hex")}
        </span>
        {seqNumsIsStale[index] && (
          <span
            onClick={() => updatedTransactionSequence(transaction.source, net)}
            style={{
              color: "#0691b7",
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-arrow-rotate-right"></i>{" "}
          </span>
        )}
        <Link
          href={`/${net}/sign-transaction?importXDR=${encodeURIComponent(
            transaction.toXDR()
          )}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          Operation type: {transaction.operations[0].type};{" "}
          <span>Signatures: {transaction.signatures.length}; </span>
          <span>Status: {TransactionStatuses.signing}</span>
        </Link>
      </td>
    </tr>
  );
};

export default InlineTransaction;
