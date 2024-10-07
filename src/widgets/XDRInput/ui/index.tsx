"use client";

import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import useTransactionValidation from "@/features/hooks/signTransaction/useTransactionValidation";
import "@/shared/styles/XDRInput/index.scss";
import __wbg_init, { decode } from "@stellar/stellar-xdr-json-web";
import stellarSdk, { Networks, Transaction } from "stellar-sdk";
import { Container } from "@/shared/ui";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import {
  FullTransaction,
  TX,
} from "@/shared/types/store/slices/BuildTransaction/buildTxJSONSlice";
const { JSONParse } = require("json-with-bigint");

interface Props {
  XDR: string;
  setXDR: (XDR: string) => void;
  isImport?: boolean;
  isSignPage?: boolean;
  baseResult?: TX;
  setIsImport?: (isImport: boolean) => void;
  setBaseResult?: (baseResult: TX) => void;
  txBuilderResult?: Transaction | null;
  setTxBuilderResult?: (txBuilderResult: Transaction | null) => void;
}

const XDRInput: FC<Props> = ({
  isSignPage = false,
  XDR,
  setXDR,
  isImport = false,
  setIsImport,
  setBaseResult,
  baseResult,
  txBuilderResult,
  setTxBuilderResult,
}) => {
  const { net, setFullTransaction, setTransaction } = useStore(
    useShallow((state) => state)
  );

  const { validationError, validateTransactionEnvelope } =
    useTransactionValidation();

  useEffect(() => {
    if (XDR) {
      validateTransactionEnvelope(XDR);
    }
  }, [XDR, validateTransactionEnvelope]);

  const decodeEnvelope = async (XDR: string) => {
    console.log(XDR);
    try {
      await __wbg_init();
      const decodedTx = JSONParse(
        decode("TransactionEnvelope", XDR)
      ) as FullTransaction;
      setTransaction(decodedTx.tx);
      setFullTransaction(decodedTx.tx);
    } catch (error) {
      console.error("Failed to decode TransactionEnvelope (base)", error);
    }
  };

  const handleToggleImport = () => {
    if (isImport) {
      setXDR("");
      setBaseResult?.({} as TX);
      setTxBuilderResult?.(null);
      setIsImport?.(false);
      return;
    }
    setIsImport?.(!isImport);
    if (!validationError && XDR) {
      if (setBaseResult && baseResult) {
        decodeEnvelope(XDR);
      }
      if (setTxBuilderResult && txBuilderResult) {
        const txBuilder = stellarSdk.TransactionBuilder.fromXDR(
          XDR,
          net === "testnet" ? Networks.TESTNET : Networks.PUBLIC
        );
        setTxBuilderResult(txBuilder);
      }
    }
  };

  const isValidXDR = XDR !== "" && !validationError;
  const validationMessage =
    XDR !== "" ? validationError || "Valid Transaction Envelope XDR" : "";

  return (
    <Container title={isSignPage ? "Sign Transaction" : "Import Transaction"}>
      <p>Import a transaction envelope in XDR format</p>
      <textarea
        value={XDR}
        onChange={(e) => setXDR(e.target.value)}
        placeholder="Ex:
              AAAAAAbxCy3mlLg3hTiQX4VUEEp6pFOrJNxYM1HJbXtTwxYh2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhWxYh2AAAAAQAQCPA8OwsZse9FAOsz/deMdhlu6/izk7SgkBG22AvpIpETBhnGkx4tF5rDZ8sVIKqwweqGUVgyUJyM0AcHbyXZQw="
        className="XDRInput"
      />
      <p className={!validationError ? "success" : "error"}>
        {validationMessage}
      </p>
      {isSignPage ? (
        isValidXDR ? (
          <Link
            href={`/public/sign-transaction?importXDR=${encodeURIComponent(
              XDR
            )}`}
            passHref
          >
            <button>Import XDR</button>
          </Link>
        ) : (
          <button disabled className="disabled">
            Import XDR
          </button>
        )
      ) : (
        <button onClick={handleToggleImport} disabled={!isValidXDR}>
          {isImport ? "Clear" : "Import XDR"}
        </button>
      )}
    </Container>
  );
};

export default XDRInput;
