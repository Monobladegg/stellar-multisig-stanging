import React, { FC, useEffect } from "react";
import Link from "next/link";
import { InputField } from "../../ui/widgets";
import useTransactionValidation from "@/features/hooks/signTransaction/useTransactionValidation";

interface Props {
  transactionEnvelope: string;
  setTransactionEnvelope: (transactionEnvelope: string) => void;
}

const TransactionForm: FC<Props> = ({
  transactionEnvelope,
  setTransactionEnvelope,
}) => {
  const { validationError, validateTransactionEnvelope } =
    useTransactionValidation();

  useEffect(() => {
    if (transactionEnvelope) {
      validateTransactionEnvelope(transactionEnvelope);
    }
  }, [transactionEnvelope, validateTransactionEnvelope]);

  return (
    <div className="container">
      <h2>Sign Transaction</h2>
      <div className="segment blank">
        <p>Import a transaction envelope in XDR format</p>
        <InputField
          value={transactionEnvelope}
          setValue={setTransactionEnvelope}
          textarea
          readOnly={false}
          placeholder="Ex:
          AAAAAAbxCy3mlLg3hTiQX4VUEEp6pFOrJNxYM1HJbXtTwxYh2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhWxYh2AAAAAQAQCPA8OwsZse9FAOsz/deMdhlu6/izk7SgkBG22AvpIpETBhnGkx4tF5rDZ8sVIKqwweqGUVgyUJyM0AcHbyXZQw="
        />
        <p className={!validationError ? "success" : "error"}>
          {transactionEnvelope !== "" &&
            (validationError || "Valid Transaction Envelope XDR")}
        </p>
        {!validationError ? (
          <Link
            href={`/public/sign-transaction?importXDR=${encodeURIComponent(
              transactionEnvelope
            )}`}
            passHref
          >
            <button>Import transaction</button>
          </Link>
        ) : (
          <button disabled className="disabled">
            Import transaction
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;
