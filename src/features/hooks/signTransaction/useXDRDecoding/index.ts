import { useState, useEffect } from "react";
import __wbg_init, { decode } from "@stellar/stellar-xdr-json-web";
import { Transaction, FeeBumpTransaction, Networks, TransactionBuilder } from "stellar-sdk";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";

const useXDRDecoding = (paramsXDRHook: string | null, envelope: string) => {
  const [XDRToTransaction, setXDRToTransaction] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [sourceAccount, setSourceAccount] = useState<string>("");
  const [sequenceNumber, setSequenceNumber] = useState<string>("");
  const [transactionFee, setTransactionFee] = useState<string>("");
  const [numberOfOperations, setNumberOfOperations] = useState<string>("");
  const [numberOfSignatures, setNumberOfSignatures] = useState<string>("");
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const {net} = useStore(useShallow(store => store))

  useEffect(() => {
    const decodeXDR = async (envelope: string) => {
      try {
        await __wbg_init();

        if (paramsXDRHook) {
          // Декодируем строку XDR и парсим envelope транзакции
          const decodedXDR = decodeURIComponent(envelope);
          const decodedTransaction = decode("TransactionEnvelope", decodedXDR);
          setXDRToTransaction(JSON.stringify(decodedTransaction, null, 2));

          const tx = TransactionBuilder.fromXDR(envelope, net === "testnet" ? Networks.TESTNET : Networks.PUBLIC);
          setTransactionHash(tx.hash().toString("hex"));

          if (tx instanceof Transaction) {
            setTransaction(tx);
            setSourceAccount(tx.source);
            setSequenceNumber(tx.sequence);
            setTransactionFee(tx.fee.toString());
            setNumberOfOperations(tx.operations.length.toString());
            setNumberOfSignatures(tx.signatures.length.toString());
          } else if (tx instanceof FeeBumpTransaction) {
            setTransaction(null);
            setSourceAccount(tx.feeSource);
            setTransactionFee(tx.fee.toString());
            setNumberOfOperations("1 (FeeBumpTransaction)");
            setNumberOfSignatures(tx.signatures.length.toString());
          }
        }
      } catch (error) {
        console.error("Error decoding XDR:", error);
      }
    };

    decodeXDR(envelope);
  }, [paramsXDRHook, envelope]);

  return { 
    XDRToTransaction, 
    transactionHash, 
    sourceAccount, 
    sequenceNumber, 
    transactionFee, 
    numberOfOperations, 
    numberOfSignatures, 
    transaction 
  };
};

export default useXDRDecoding;
