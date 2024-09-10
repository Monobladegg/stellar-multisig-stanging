"use client";

import React, { FC, useState } from "react";
import { MainLayout } from "@/widgets";
import { useSearchParams } from "next/navigation";
import {
  TransactionForm,
  TransactionOverview,
} from "@/widgets/SignTransaction";
import { useTransactionValidation, useXDRDecoding } from "@/features/hooks";

const SignTransaction: FC = () => {
  const params = useSearchParams();
  const paramsXDRHook = params?.get("importXDR") ?? null;

  const [transactionEnvelope, setTransactionEnvelope] = useState<string>(
    window.location.search
    .slice(1)
    .replace("importXDR=", "")
    .replace("}", "") || ""
  );
  const { validationError, validateTransactionEnvelope } =
    useTransactionValidation();
  const { XDRToTransaction, transactionHash } = useXDRDecoding(paramsXDRHook, transactionEnvelope);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const envelope = event.target.value;
    setTransactionEnvelope(envelope);
    validateTransactionEnvelope(envelope);
  };

  if (paramsXDRHook) {
    return (
      <MainLayout>
        <TransactionOverview
          transactionEnvelope={transactionEnvelope}
          XDRToTransaction={XDRToTransaction}
          transactionHash={transactionHash}
        />
      </MainLayout>
    );
  } else {
    return (
      <MainLayout>
        <TransactionForm
          transactionEnvelope={transactionEnvelope}
          validationError={validationError}
          isTransactionEnvelopeValid={validationError === null}
          handleInputChange={handleInputChange}
        />
      </MainLayout>
    );
  }
};

export default SignTransaction;
