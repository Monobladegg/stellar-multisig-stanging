"use client";

import React, { FC, useState, useEffect } from "react";
import { MainLayout, ShowXdr } from "@/widgets";
import { useSearchParams } from "next/navigation";
import {
  TransactionForm,
  TransactionOverview,
  TransactionSignatures,
  ShowXdrButtons,
} from "@/widgets/SignTransaction";
import useTransactionValidation from "@/features/hooks/signTransaction/useTransactionValidation";
import useXDRDecoding from "@/features/hooks/signTransaction/useXDRDecoding";
import {
  TransactionBuilder,
  Networks,
  Transaction,
  FeeBumpTransaction,
} from "stellar-sdk";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";

export type localSignature = string[];

const SignTransaction: FC = () => {
  const params = useSearchParams();
  const importXDR = params?.get("importXDR") ?? "";

  const net = useStore(useShallow((state) => state.net));

  const [transactionEnvelope, setTransactionEnvelope] =
    useState<string>(importXDR);
  const [resultXdr, setResultXdr] = useState<string>("");
  const [currentTransaction, setCurrentTransaction] = useState<
    Transaction | FeeBumpTransaction | null
  >(null);
  const [localSignatures, setLocalSignatures] = useState<localSignature>([""]);

  const { validationError, validateTransactionEnvelope } =
    useTransactionValidation();

  useEffect(() => {
    if (transactionEnvelope) {
      validateTransactionEnvelope(transactionEnvelope);
    }
  }, [transactionEnvelope, validateTransactionEnvelope]);

  const {
    transactionHash,
    sourceAccount,
    sequenceNumber,
    transactionFee,
    numberOfOperations,
    numberOfSignatures,
    transaction,
  } = useXDRDecoding(net, transactionEnvelope);

  useEffect(() => {
    if (resultXdr) {
      try {
        const tx = TransactionBuilder.fromXDR(
          resultXdr,
          net === "testnet" ? Networks.TESTNET : Networks.PUBLIC
        );
        setCurrentTransaction(tx);
      } catch (e) {
        console.error("Invalid XDR", e);
        setCurrentTransaction(null);
      }
    }
  }, [resultXdr, net]);

  useEffect(() => {
    if (!transactionEnvelope) {
      setLocalSignatures([""]);
      setResultXdr("");
      setCurrentTransaction(null);
    }
  }, [transactionEnvelope]);

  return (
    <MainLayout>
      {importXDR ? (
        <>
          <TransactionOverview
            transactionEnvelope={transactionEnvelope}
            transactionHash={transactionHash}
            sourceAccount={sourceAccount}
            sequenceNumber={sequenceNumber}
            transactionFee={transactionFee}
            numberOfOperations={numberOfOperations}
            numberOfSignatures={numberOfSignatures}
          />
          <TransactionSignatures
            localSignatures={localSignatures}
            setLocalSignatures={setLocalSignatures}
            transactionEnvelope={transactionEnvelope}
            resultXdr={resultXdr}
            setResultXdr={setResultXdr}
            currentTransaction={transaction}
          />
          {resultXdr && (
            <ShowXdr
              title="Transaction signed!"
              upperDescription={`${localSignatures.length} signature(s) added; ${
                currentTransaction?.signatures.length || 0
              } signature(s) total`}
              xdr={resultXdr}
              lowerDescription="Now that this transaction is signed, you can submit it to the network. Horizon provides an endpoint called Post Transaction that will relay your transaction to the network and inform you of the result."
              buttons={<ShowXdrButtons />}
            />
          )}
        </>
      ) : (
        <TransactionForm transactionEnvelope={transactionEnvelope} setTransactionEnvelope={setTransactionEnvelope} />
      )}
    </MainLayout>
  );
};

export default SignTransaction;
