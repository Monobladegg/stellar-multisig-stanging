import React, { FC } from "react";
import Link from "next/link";

interface TransactionOverviewProps {
  transactionEnvelope: string;
  XDRToTransaction: string;
  transactionHash: string;
}

const TransactionOverview: FC<TransactionOverviewProps> = ({
  transactionEnvelope,
  XDRToTransaction,
  transactionHash,
}) => {
  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Transaction Overview</h1>
        <Link href="/public/sign-transaction">
          <button style={{ marginTop: "10px" }}>Clear and import new</button>
        </Link>
      </div>
      <div className="segment blank">
        <h3>Signing for</h3>
        <input
          value="Public Global Stellar Network ; September 2015"
          style={{
            width: "100%",
            maxHeight: "70px",
            border: "1px solid #535759",
          }}
          readOnly
        />
        <h3>Transaction Envelope</h3>
        <textarea
          value={transactionEnvelope}
          style={{
            width: "100%",
            height: "130px",
            border: "1px solid #535759",
          }}
          readOnly
        />
        <h3>Decoded Transaction</h3>
        <textarea
          value={XDRToTransaction}
          style={{
            width: "100%",
            height: "300px",
            border: "1px solid #535759",
          }}
          readOnly
        />
        <h3>Transaction Hash</h3>
        <input
          value={transactionHash}
          style={{
            width: "100%",
            maxHeight: "70px",
            border: "1px solid #535759",
          }}
          readOnly
        />
      </div>
    </div>
  );
};

export default TransactionOverview;
