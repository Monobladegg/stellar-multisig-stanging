"use client";

import { useStore } from "@/shared/store";
import React, { FC, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useXDRDecoding } from "@/features/hooks";

interface Props {
  title?: string;
  upperDescription?: string;
  xdr?: string | null;
  lowerDescription?: string;
  showHash?: boolean;
  showNetPassphrase?: boolean;
  buttons?: React.ReactNode;
}

const ShowXdr: FC<Props> = ({
  title,
  upperDescription,
  xdr,
  showNetPassphrase,
  showHash,
  lowerDescription,
  buttons,
}) => {
  const [isCopy, setIsCopy] = useState(false);

  const { net } = useStore(useShallow((state) => state));
  const { transaction, transactionHash } = useXDRDecoding(net, xdr ?? "");

  useEffect(() => {
    console.log(xdr);
    console.log(transaction);
  }, [xdr, transaction]);

  return (
    <div className="container">
      <div style={{ marginTop: "20px" }} className="segment blank">
        {!xdr ? (
          <h3>Error, xdr is undefined</h3>
        ) : (
          <>
            <h3 className="success">{title}</h3>
            <p>{upperDescription}</p>
            <textarea
              value={
                xdr && !showNetPassphrase && !showHash
                  ? xdr
                  : !showNetPassphrase && showHash
                  ? `Hash:\n${transactionHash}\nXDR:\n${xdr}`
                  : showNetPassphrase && !showHash
                  ? `Network Passphrase:\n${transaction?.networkPassphrase}\nXDR:\n${xdr}`
                  : `Network Passphrase:\n${transaction?.networkPassphrase}\nHash:\n${transactionHash}\nXDR:\n${xdr}`
              }
              readOnly
              style={{ height: "120px", border: "1px solid #535759" }}
            />

            <p
              style={{ cursor: "pointer", position: "absolute", right: "30px" }}
              onClick={() => {
                navigator.clipboard.writeText(xdr);
                setIsCopy(true);
                setTimeout(() => setIsCopy(false), 2000);
              }}
              title="Copy XDR"
            >
              <i className="fa-solid fa-copy"></i>
            </p>
            {isCopy && (
              <p style={{ textAlign: "right", opacity: "0.8" }}>Copied XDR</p>
            )}
            <p>{lowerDescription}</p>
            <div style={{ marginTop: "-10px" }}>
            {buttons}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShowXdr;
