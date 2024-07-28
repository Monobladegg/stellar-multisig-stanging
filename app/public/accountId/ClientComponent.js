// app/public/[id]/ClientComponent.js

"use client"; // Обозначает, что этот файл и его дети будут использоваться на клиентской стороне

import { useEffect, useState } from 'react';
import PublicNet from "./publicnet";
import StellarSdk from 'stellar-sdk';

const ClientComponent = ({ params }) => {

  if (!StellarSdk.StrKey.isValidEd25519PublicKey(params.id)) {
    // Handle case where params are not found or invalid
    return (
        <div className="container">
            <div
                className={`search error container narrow`}
                style={{ padding: "20px" }}
            >
                <h2 className="text-overflow">Search results for {params.id}</h2>
                <div>User ID not found or invalid.</div>
            </div>
        </div>
    );
  } else return <PublicNet id={params.id} />;

};

export default ClientComponent;
