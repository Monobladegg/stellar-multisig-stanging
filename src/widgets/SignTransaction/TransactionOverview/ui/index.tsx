import React, { FC } from "react";
import { Header, InputField, InputGroup } from "../../ui/widgets"
import { Networks } from "stellar-sdk";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";

interface TransactionOverviewProps {
  transactionEnvelope: string;
  transactionHash: string;
  sourceAccount: string;
  sequenceNumber: string;
  transactionFee: string;
  numberOfOperations: string;
  numberOfSignatures: string;
}

const TransactionOverview: FC<TransactionOverviewProps> = ({
  transactionEnvelope,
  transactionHash,
  sourceAccount,
  sequenceNumber,
  transactionFee,
  numberOfOperations,
  numberOfSignatures,
}) => {

  const {net} = useStore(useShallow(state => state));

  return (
    <div className="container" style={{ color: "#fff" }}>
      {/* Header */}
      <Header title="Transaction Overview" button={true} />

      <div className="segment blank">
        {/* Signing for input */}
        <InputField
          label="Signing for"
          value={ net === "testnet" ? Networks.TESTNET : Networks.PUBLIC}
        />

        {/* Transaction Envelope XDR */}
        <InputField label="Transaction Envelope XDR" value={transactionEnvelope} textarea />

        {/* Transaction Hash */}
        <InputField label="Transaction Hash" value={transactionHash} />

        {/* Source Account */}
        <InputField label="Source account" value={sourceAccount} />

        {/* Input Group */}
        <InputGroup
          sequenceNumber={sequenceNumber}
          transactionFee={transactionFee}
          numberOfOperations={numberOfOperations}
          numberOfSignatures={numberOfSignatures}
        />
      </div>
    </div>
  );
};

export default TransactionOverview;
