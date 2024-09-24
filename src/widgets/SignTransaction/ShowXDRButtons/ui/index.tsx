import {
  sendSignatureToTransaction as sendSignatureToTransactionFirebase,
  sendTransaction as sendTransactionFirebase,
} from "@/shared/api/firebase";
import { useStore } from "@/shared/store";
import React, { FC } from "react";
import { Transaction } from "stellar-sdk";
import { useShallow } from "zustand/react/shallow";

interface Props {
  transaction: Transaction | null;
  currentFirebaseId: string;
}

const ShowXDRButtons: FC<Props> = ({ transaction, currentFirebaseId }) => {
  const { net } = useStore(useShallow((state) => state));
  const sendSignatureToTransaction = async () => {
    const txHash = await sendSignatureToTransactionFirebase(
      currentFirebaseId,
      transaction,
      net
    );
    console.log(txHash);
  };
  const sendTransaction = async () => {
    const txHash = await sendTransactionFirebase(transaction, net);
    console.log(txHash);
  };

  const onClick = () => {
    if (currentFirebaseId) {
      sendSignatureToTransaction();
    } else {
      sendTransaction();
    }
  };
  return (
    <button
      onClick={onClick}
    >
      {currentFirebaseId ? "Update transaction with new signature(s)" : "Send Sign to Transaction"}
    </button>
  );
};

export default ShowXDRButtons;
