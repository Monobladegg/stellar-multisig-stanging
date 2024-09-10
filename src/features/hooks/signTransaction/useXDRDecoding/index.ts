import React, { useState, useEffect } from "react";
import __wbg_init, { decode } from "@stellar/stellar-xdr-json-web";
import stellarSdk from "stellar-sdk";

const useXDRDecoding = (paramsXDRHook: string | null, envelope: string) => {
  const [XDRToTransaction, setXDRToTransaction] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string>("");

  useEffect(() => {
    const decodeXDR = async (envelope: string) => {
      try {
        await __wbg_init();

        if (paramsXDRHook) {
          // Decode the XDR string and parse the transaction envelope
          const decodedXDR = decodeURIComponent(envelope);
          const decodedTransaction = decode("TransactionEnvelope", decodedXDR);
          setXDRToTransaction(JSON.stringify(decodedTransaction, null, 2));

          // Build the transaction and calculate its hash
          const transaction = new stellarSdk.TransactionBuilder.fromXDR(
            envelope,
            stellarSdk.Networks.PUBLIC
          );
          setTransactionHash(transaction.hash().toString("hex"));
        }
      } catch (error) {
        console.error("Error decoding XDR:", error);
      }
    };

    decodeXDR(envelope);
  }, [paramsXDRHook, envelope]);

  return { XDRToTransaction, transactionHash };
};

export default useXDRDecoding;
