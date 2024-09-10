import React, { FC } from "react";
import Link from "next/link";

interface TransactionFormProps {
  transactionEnvelope: string;
  validationError: string | null;
  isTransactionEnvelopeValid: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TransactionForm: FC<TransactionFormProps> = ({
  transactionEnvelope,
  validationError,
  isTransactionEnvelopeValid,
  handleInputChange,
}) => {
  return (
    <div className="container">
      <div className="segment blank">
        <h4>Import a transaction envelope in XDR format</h4>
        <textarea
          placeholder="Ex: AAAABbxCy3mLg3hiTqX4VUEEp60pFOrJNxYM1JbxTwXhY2AAAAZAAAABAAAAAGAAAAAAAAAAEAAAAAAAAAAQAAAAAAAAJAAAAAAAAAAHwXhY2AAAAQCPAo8QwsZe9FA0sz/deMdhlutG7f7SgkBG222ApvfpETBhnGKX4trSFDz8sVlKqvweqGUVgvjUyM0AcHxyXZQw="
          style={{
            width: "100%",
            height: "100px",
            border: "1px solid #535759",
            padding: "10px",
            fontSize: "16px",
          }}
          value={transactionEnvelope}
          onChange={handleInputChange}
        />
        <p className={validationError === null ? "success" : "error"}>
          {validationError === null && "Valid Transaction Envelope XDR"}
        </p>
        <Link
          href={`/public/sign-transaction${
            validationError === null ? `?importXDR=${transactionEnvelope}` : ""
          }`}
        >
          <button
            className={!isTransactionEnvelopeValid ? "disabled" : ""}
            disabled={!isTransactionEnvelopeValid}
          >
            Import transaction
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TransactionForm;
