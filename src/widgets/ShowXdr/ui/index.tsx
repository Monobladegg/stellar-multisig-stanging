"use client";

import React, { FC } from "react";

interface Props {
  title?: string;
  upperDescription?: string;
  xdr?: string | null;
  lowerDescription?: string;
  buttons?: React.ReactNode;
}

const ShowXdr: FC<Props> = ({
  title,
  upperDescription,
  xdr,
  lowerDescription,
  buttons,
}) => {
  if (!xdr) return null;
  return (
    <div className="container">
      <div style={{ marginTop: "20px" }} className="segment blank">
        <h3 className="success">{title}</h3>
        <p>{upperDescription}</p>
        <textarea value={xdr} readOnly style={{ height: "120px", border: "1px solid #535759" }} />
        <p style={{ cursor: "pointer", textAlign: "right" }} onClick={() => navigator.clipboard.writeText(xdr)}><i className="fa-solid fa-copy"></i></p>
        <p>{lowerDescription}</p>
        {buttons}
      </div>
    </div>
  );
};

export default ShowXdr;
