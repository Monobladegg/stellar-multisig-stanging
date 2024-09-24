"use client";

import React, { FC, useState, useEffect, useMemo } from "react";
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
import ShowXDRButtons from "@/widgets/SignTransaction/ShowXDRButtons";
import { getAllTransactions } from "@/shared/api/firebase/firestore/Transactions";

export type localSignature = string[];

const SignTransaction: FC = () => {
  // Retrieve the 'importXDR' query parameter from the URL
  const params = useSearchParams();
  const importXDRParam = params?.get("importXDR") ?? "";

  const [signaturesAdded, setSignaturesAdded] = useState<number>(0);
  const [currentFirebaseId, setCurrentFirebaseId] = useState<string>("");

  // Access the network state ('testnet' or 'public') from the global store
  const net = useStore((state) => state.net);

  // Initialize state variables for the transaction envelope and result XDR
  const [transactionEnvelope, setTransactionEnvelope] = useState<string>(
    importXDRParam
  );
  const [resultXdr, setResultXdr] = useState<string>("");
  const [localSignatures, setLocalSignatures] = useState<localSignature>([""]);
  const [errorMessageFirebase, setErrorMessageFirebase] = useState<string>("");
  const [successMessageFirebase, setSuccessMessageFirebase] = useState<string>(
    ""
  );

  // Custom hook to validate the transaction envelope
  const { validateTransactionEnvelope } = useTransactionValidation();

  // Validate the transaction envelope whenever it changes
  useEffect(() => {
    if (transactionEnvelope) {
      validateTransactionEnvelope(transactionEnvelope);
    }
  }, [transactionEnvelope]);

  // Decode the transaction envelope using a custom hook
  const {
    transactionHash,
    sourceAccount,
    sequenceNumber,
    transactionFee,
    operationCount,
    signatureCount,
    transaction,
  } = useXDRDecoding(net, transactionEnvelope);

  // Memoize the current transaction to optimize performance
  const currentTransaction = useMemo(() => {
    if (!resultXdr) return null;
    try {
      // Reconstruct the transaction from the result XDR
      return TransactionBuilder.fromXDR(
        resultXdr,
        net === "testnet" ? Networks.TESTNET : Networks.PUBLIC
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [resultXdr, net]);

  // Fetch all transactions from Firebase to find the matching transaction ID
  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const data = await getAllTransactions(net);
        // Find the transaction that matches the current envelope
        const matchingDoc = data.find(
          (doc) => doc.xdr === transactionEnvelope
        );
        if (matchingDoc) {
          setCurrentFirebaseId(matchingDoc.id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!transactionEnvelope) {
      // Reset state if the transaction envelope is empty
      setLocalSignatures([""]);
      setResultXdr("");
    } else {
      fetchAllTransactions();
    }
  }, [transactionEnvelope, net]);

  return (
    <MainLayout>
      {importXDRParam ? (
        <>
          {/* Render an overview of the transaction details */}
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
          {/* Component for adding and managing signatures */}
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
            // Display the signed transaction XDR with additional options
            <ShowXdr
              title="Transaction signed!"
              upperDescription={`${signaturesAdded} signature(s) added; ${
                currentTransaction?.signatures.length || 0
              } signature(s) total`}
              xdr={resultXdr}
              lowerDescription="Now that this transaction is signed, you can submit it to the network. Horizon provides an endpoint called Post Transaction that will relay your transaction to the network and inform you of the result."
              buttons={
                // Render buttons for actions like submitting or saving the transaction
                <ShowXDRButtons
                  XDR={resultXdr}
                  currentFirebaseId={currentFirebaseId}
                  successMessageFirebase={successMessageFirebase}
                  setSuccessMessageFirebase={setSuccessMessageFirebase}
                  setErrorMessageFirebase={setErrorMessageFirebase}
                />
              }
              successMessage={successMessageFirebase}
              errorMessage={errorMessageFirebase}
            />
          )}
        </>
      ) : (
        // If no transaction envelope is provided, render the form to input one
        <TransactionForm
          transactionEnvelope={transactionEnvelope}
          setTransactionEnvelope={setTransactionEnvelope}
        />
      )}
    </MainLayout>
  );
};

export default SignTransaction;
