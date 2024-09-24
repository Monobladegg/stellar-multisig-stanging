"use client";

import React, { FC, useState, useEffect } from "react";
import { MainLayout, ShowXdr } from "@/widgets";
import { useSearchParams } from "next/navigation";
import {
  TransactionForm,
  TransactionOverview,
  TransactionSignatures,
} from "@/widgets/SignTransaction";
import useTransactionValidation from "@/features/hooks/signTransaction/useTransactionValidation";
import useXDRDecoding from "@/features/hooks/signTransaction/useXDRDecoding";
import {
  TransactionBuilder,
  Networks,
  Transaction,
  FeeBumpTransaction,
} from "stellar-sdk";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import ShowXDRButtons from "@/widgets/SignTransaction/ShowXDRButtons";
import { getAllTransactions } from "@/shared/api/firebase/firestore/Transactions";

export type localSignature = string[];

const SignTransaction: FC = () => {
  const params = useSearchParams();
  const importXDR = params?.get("importXDR") ?? "";
  const [signaturesAdded, setSignaturesAdded] = useState<number>(0);
  const [currentFirebaseId, setCurrentFirebaseId] = useState<string>("");

  const { net } = useStore(useShallow((state) => state));

  const [transactionEnvelope, setTransactionEnvelope] =
    useState<string>(importXDR);
  const [resultXdr, setResultXdr] = useState<string>("");
  const [currentTransaction, setCurrentTransaction] = useState<
    Transaction | FeeBumpTransaction | null
  >(null);
  const [localSignatures, setLocalSignatures] = useState<localSignature>([""]);

  const { validateTransactionEnvelope } = useTransactionValidation();

  useEffect(() => {
    if (transactionEnvelope) validateTransactionEnvelope(transactionEnvelope);
  }, [transactionEnvelope, validateTransactionEnvelope]);

  const {
    transactionHash,
    sourceAccount,
    sequenceNumber,
    transactionFee,
    operationCount,
    signatureCount,
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
        console.error(e);
        setCurrentTransaction(null);
      }
    }
  }, [resultXdr, net]);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      getAllTransactions(net).then((data) => {
        data.map((doc) => {
          console.log(doc);
          if (doc.xdr === transactionEnvelope) {
            setCurrentFirebaseId(doc.id);
            console.log(doc.id);
          }
        });
      });
    };
    console.log(transactionEnvelope);
    if (!transactionEnvelope) {
      setLocalSignatures([""]);
      setResultXdr("");
      setCurrentTransaction(null);
    } else {
      fetchAllTransactions();
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
            operationCount={operationCount}
            signatureCount={signatureCount}
            transaction={transaction}
          />
          <TransactionSignatures
            localSignatures={localSignatures}
            setLocalSignatures={setLocalSignatures}
            transactionEnvelope={transactionEnvelope}
            resultXdr={resultXdr}
            setResultXdr={setResultXdr}
            currentTransaction={transaction}
            setSignaturesAdded={setSignaturesAdded}
            signaturesAdded={signaturesAdded}
          />
          {resultXdr && (
            <ShowXdr
              title="Transaction signed!"
              upperDescription={`${signaturesAdded} signature(s) added; ${
                currentTransaction?.signatures.length || 0
              } signature(s) total`}
              xdr={resultXdr}
              lowerDescription="Now that this transaction is signed, you can submit it to the network. Horizon provides an endpoint called Post Transaction that will relay your transaction to the network and inform you of the result."
              buttons={
                <ShowXDRButtons
                  transaction={transaction}
                  currentFirebaseId={currentFirebaseId}
                />
              }
            />
          )}
        </>
      ) : (
        <TransactionForm
          transactionEnvelope={transactionEnvelope}
          setTransactionEnvelope={setTransactionEnvelope}
        />
      )}
    </MainLayout>
  );
};

export default SignTransaction;
