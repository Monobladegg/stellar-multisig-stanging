"use client";

import React, { useEffect, useState } from "react";
import { MainLayout, SetOptions, ManageData } from "@/widgets";
import StellarSdk from "stellar-sdk";
import axios from "axios";
import { Information } from "@/shared/types";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";
import __wbg_init, { encode } from "@stellar/stellar-xdr-json-web"
import { IOperation } from "@/shared/types/store/slices/buildTxJSONSlice";

type MemoType = "None" | "Text" | "ID" | "Hash" | "Return";
type TransactionType = "Transaction" | "Fee Bump";
type OperationType = "set_options" | "manage_data"

const memoTypes: MemoType[] = ["None", "Text", "ID", "Hash", "Return"]

export function stringToHex(str: string) {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return hex;
}

export function hexToString(hex: string) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

const Page: React.FC = () => {
  const {
    tx,
    setSourceAccount,
    setFee,
    setSeqNum,
    setTimeCondition,
    setMemo,
    addOperation,
    removeOperation: storeRemoveOperation,
    setOperations,
    fullTransaction
  } = useStore(useShallow((state) => state));

  const [memoInput, setMemoInput] = useState<string>("");
  const [sourceAccountInputIsValid, setSourceAccountInputIsValid] =
    useState<boolean>(false);
  const [txBuildErrors, setTxBuildErrors] = useState<string[]>([]);
  const [currentXDR, setCurrentXDR] = useState<string>("");

  useEffect(() => {
    setSourceAccountInputIsValid(
      StellarSdk.StrKey.isValidEd25519PublicKey(tx.tx.source_account)
    );
  }, [tx.tx.source_account]);

  const handleAddOperation = () => {
    addOperation("manage_data");
  };

  const updateErrors = (condition: boolean, errorMessage: string) => {
    setTxBuildErrors(prevErrors =>
      condition
        ? !prevErrors.includes(errorMessage)
          ? prevErrors.concat(errorMessage)
          : prevErrors
        : prevErrors.includes(errorMessage)
          ? prevErrors.filter(error => error !== errorMessage)
          : prevErrors
    );
  };

  useEffect(() => {
    updateErrors(
      !StellarSdk.StrKey.isValidEd25519PublicKey(tx.tx.source_account),
      "Source Account is a required field"
    );
  }, [tx.tx.source_account]);

  useEffect(() => {
    updateErrors(
      !tx.tx.seq_num,
      "Transaction Sequence Number is a required field"
    );
  }, [tx.tx.seq_num]);

  useEffect(() => {
    updateErrors(
      !tx.tx.fee,
      "Fee is a required field"
    );
  }, [tx.tx.fee]);

  useEffect(() => {
    updateErrors(
      tx.tx.memo !== "none" && !memoInput,
      "Memo value is required when memo type is selected"
    );
  }, [tx.tx.memo, memoInput]);

  useEffect(() => {
    if (memoInput !== "" && tx.tx.memo !== "none") {
      if (tx.tx.memo.text !== undefined && memoInput.length > 28) {
        updateErrors(true, "Memo text is too long. Max 28 characters allowed.");
      } else if (tx.tx.memo.id !== undefined && isNaN(parseInt(memoInput))) {
        updateErrors(true, "Memo ID must be a number.");
      } else if (
        (tx.tx.memo.hash !== undefined || tx.tx.memo.return !== undefined) &&
        !/^[0-9a-f]{64}$/.test(memoInput)
      ) {
        updateErrors(true, "Memo hash or return must be a 64 character hexadecimal string.");
      } else {
        updateErrors(false, "Memo text is too long. Max 28 characters allowed.");
        updateErrors(false, "Memo ID must be a number.");
        updateErrors(false, "Memo hash or return must be a 64 character hexadecimal string.");
      }
    }
  }, [memoInput, tx.tx.memo]);

  useEffect(() => {
    console.log(txBuildErrors)
  }, [txBuildErrors])

  const duplicateOperation = (index: number) => {
    if (index >= 0 && index < tx.tx.operations.length) {
      const operationToDuplicate = tx.tx.operations[index];
      if (operationToDuplicate) {
        setOperations([
          ...tx.tx.operations,
          { ...operationToDuplicate, source_account: operationToDuplicate.source_account }
        ]);
      }
    }
  };

  const removeOperation = (index: number) => {
    setOperations(tx.tx.operations.filter((_, i) => i !== index));
  };

  const setTimeBoundsToFiveMinutes = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimeCondition(Number(""), now + 300);
  };

  const setTransactionSequenceNumberCurrent = async () => {
    try {
      const { data } = await axios.get<Information>(
        `https://horizon.stellar.org/accounts/${tx.tx.source_account}`
      );
      setSeqNum(data.sequence !== undefined ? data.sequence + 1 : 0);
    } catch (error) {
      console.error("Error fetching transaction sequence number", error);
    }
  };

  const setOperationType = (index: number, type: OperationType) => {
    if (index >= 0 && index < tx.tx.operations.length) {
      const updatedOperations = [...tx.tx.operations];
      updatedOperations[index] = {
        ...updatedOperations[index],
        body: type === "set_options" ? { set_options: {} } : { manage_data: { data_name: "", data_value: null } }
      };
      setOperations(updatedOperations);
    }
  };

  const getOperationType = (operation: IOperation): OperationType => {
    return operation.body.set_options ? "set_options" : "manage_data";
  };

  useEffect(() => {
    const initializeWasm = async () => {
      try {
        console.log('Initializing WebAssembly module...');
        await __wbg_init(/* path to your module */);
        console.log('WebAssembly module initialized.');

        if (!fullTransaction || typeof fullTransaction !== 'object' || !fullTransaction.tx) {
          throw new Error('Invalid fullTransaction object structure');
        }

        // Create the correct TransactionEnvelope structure
        const transactionEnvelope = {
          tx: fullTransaction.tx
        };

        const jsonTx = JSON.stringify(transactionEnvelope, null, 2);
        console.log('JSON TransactionEnvelope:', jsonTx);

        const xdrType = 'TransactionEnvelope';
        console.log('Input to encode:', jsonTx);
        const xdrEncoded = encode(xdrType, jsonTx);
        console.log('Encoded XDR:', xdrEncoded);
        setCurrentXDR(xdrEncoded);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
      }
    };

    console.log('Calling initializeWasm with fullTransaction:', fullTransaction);
    initializeWasm();
  }, [fullTransaction]);

  return (
    <MainLayout>
      <div className="container">
        <div className="segment blank">
          {/* Source Account */}
          <div>
            <h4>Source Account</h4>
            <input
              placeholder="Example: GCEXAMPLE5HWNK4AYSTEO4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG"
              value={tx.tx.source_account}
              onChange={(e) => setSourceAccount(e.target.value)}
            />
            {!sourceAccountInputIsValid && tx.tx.source_account && (
              <p className="error">Invalid source account</p>
            )}
          </div>

          {/* Transaction Sequence Number */}
          <div>
            <h4>Transaction Sequence Number</h4>
            <input
              placeholder="Example: 55834579143"
              value={tx.tx.seq_num}
              onChange={(e) => setSeqNum(e.target.value)}
            />
            {sourceAccountInputIsValid && (
              <>
                <button onClick={setTransactionSequenceNumberCurrent}>
                  Fetch next sequence number for account starting with{" "}
                  {tx.tx.source_account.slice(0, 5)}...
                </button>
                <p>Fetching from: https://horizon.stellar.org</p>
              </>
            )}
          </div>

          {/* Base Fee */}
          <div>
            <h4>Base Fee</h4>
            <input
              placeholder="Amount in stroops (1 lumen = 10,000,000 stroops)"
              value={tx.tx.fee}
              onChange={(e) => setFee(Number(e.target.value))}
            />
            <p>
              The base inclusion fee is currently set to 100 stroops (0.00001
              lumens). For more real-time inclusion fee, please see{" "}
              <a
                href="https://developers.stellar.org/docs/data/rpc/api-reference/methods/getFeeStats"
                target="_blank"
                rel="noopener noreferrer"
              >
                getFeeStats
              </a>{" "}
              from the RPC. To learn more about fees, please see{" "}
              <a
                href="https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fees & Metering
              </a>
              .
            </p>
          </div>

          {/* Memo */}
          <div>
            <h4>Memo</h4>
            {memoTypes.map((type) => {
              return (
                <button
                  key={type}
                  className={`button ${tx.tx.memo === type.toLowerCase() ? 'disabled' : ''}`}
                  onClick={() => {
                    if (type === 'None') {
                      setMemo('none');
                    } else if (type === 'Text') {
                      setMemo({ text: memoInput });
                    } else if (type === 'ID') {
                      setMemo({ id: memoInput });
                    } else if (type === 'Hash') {
                      setMemo({ hash: memoInput });
                    } else if (type === 'Return') {
                      setMemo({ return: memoInput });
                    }
                  }}
                  disabled={
                    tx.tx.memo === type.toLowerCase() ||
                    (type === "Text" && typeof tx.tx.memo === "object" && tx.tx.memo.text !== undefined) ||
                    (type === "ID" && typeof tx.tx.memo === "object" && tx.tx.memo.id !== undefined) ||
                    (type === "Hash" && typeof tx.tx.memo === "object" && tx.tx.memo.hash !== undefined) ||
                    (type === "Return" && typeof tx.tx.memo === "object" && tx.tx.memo.return !== undefined)
                  }
                >
                  {type}
                </button>
              )
            })}

            {tx.tx.memo !== "none" && (
              <input
                placeholder={
                  tx.tx.memo.text !== undefined
                    ? "UTF-8 string of up to 28 bytes"
                    : tx.tx.memo.id !== undefined
                      ? "Unsigned 64-bit integer"
                      : tx.tx.memo.hash !== undefined
                        ? "32-byte hash in hexadecimal format (64 [0-9a-f] characters)"
                        : "Return value"
                }
                value={memoInput}
                onChange={(e) => {
                  setMemoInput(e.target.value)
                  if (typeof tx.tx.memo === "object") {
                    if (tx.tx.memo.text !== undefined) {
                      setMemo({ text: e.target.value });
                    } else if (tx.tx.memo.id !== undefined) {
                      setMemo({ id: e.target.value });
                    } else if (tx.tx.memo.hash !== undefined) {
                      setMemo({ hash: e.target.value });
                    } else if (tx.tx.memo.return !== undefined) {
                      setMemo({ return: e.target.value });
                    }
                  }
                }}
              />
            )}
            {tx.tx.memo !== "none" && (
              <p className="error">
                {memoInput !== "" && (<>
                  {tx.tx.memo.text !== undefined && memoInput.length > 28 && (
                    <span>Text memo cannot be longer than 28 bytes</span>
                  )}
                  {tx.tx.memo.id !== undefined && isNaN(parseInt(memoInput)) && (
                    <span>ID memo must be an unsigned 64-bit integer</span>
                  )}
                  {tx.tx.memo.hash !== undefined && !/^[0-9a-f]{64}$/.test(memoInput) && (
                    <span>Hash memo must be a 32-byte hash in hexadecimal format (64 [0-9a-f] characters)</span>
                  )}
                  {tx.tx.memo.return !== undefined && !/^[0-9a-f]{64}$/.test(memoInput) && (
                    <span>Return memo must be a 32-byte hash in hexadecimal format (64 [0-9a-f] characters)</span>
                  )}
                </>)}
              </p>
            )}
          </div>

          {/* Time Bounds */}
          <div>
            <h4>Time Bounds</h4>
            <input
              placeholder="Lower time bound unix timestamp. Example: 1479151713"
              value={tx.tx.cond.time.min_time}
              onChange={(e) => {
                setTimeCondition(Number(e.target.value), tx.tx.cond.time.max_time);
              }}
            />
            <input
              placeholder="Upper time bound unix timestamp. Example: 1479151713"
              value={tx.tx.cond.time.max_time}
              onChange={(e) => {
                setTimeCondition(tx.tx.cond.time.min_time, Number(e.target.value));
              }}
            />
            <button onClick={setTimeBoundsToFiveMinutes}>
              Set to 5 minutes from now
            </button>
          </div>

          {/* Operations */}
          <div className="segment blank items-center mt-5">
            {tx.tx.operations.map((operation, index) => (
              <div key={index} className="blank flex">
                <div
                  style={{
                    borderRight: "1px solid #535759",
                    borderBottom: "1px solid #535759",
                    paddingRight: "10px",
                  }}
                  className="flex flex-col"
                >
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    className="text-center blank"
                  >
                    {index + 1}
                  </div>
                  <button onClick={() => duplicateOperation(index)}>
                    Duplicate
                  </button>
                  {tx.tx.operations.length > 1 && (
                    <button onClick={() => removeOperation(index)}>
                      Remove
                    </button>
                  )}
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #535759",
                    paddingLeft: "10px",
                  }}
                >
                  <h4>Operation Type</h4>
                  <select
                    className="input"
                    value={getOperationType(operation)}
                    onChange={(e) =>
                      setOperationType(
                        index,
                        e.target.value as OperationType
                      )
                    }
                  >
                    <option value="manage_data">Manage Data</option>
                    <option value="set_options">Set Options</option>
                  </select>

                  <div className="mt-3">
                    {getOperationType(operation) === "set_options" && (
                      <SetOptions id={index} />
                    )}
                    {getOperationType(operation) === "manage_data" && (
                      <ManageData id={index} />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={handleAddOperation} className="mt-3">
              Add New Operation
            </button>
          </div>
        </div>
        <div style={{ marginTop: "20px" }} className="segment blank">
          {txBuildErrors.length > 0 ? (
            <>
              <h2>Transaction building errors:</h2>
              <ul>
                {txBuildErrors.map((error, index) => (
                  <li key={index}>{`- ${error}`}</li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h1>Here your XDR transaction:</h1>
              <h3>{currentXDR}{" "}<span style={{ cursor: "pointer" }} onClick={() => navigator.clipboard.writeText(currentXDR)}><i className="fa-regular fa-copy"></i></span></h3>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Page;
