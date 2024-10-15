"use client";

import { FC, useState, useEffect } from "react";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";

const MemoInput: FC = () => {
  const { tx, setMemo } = useStore(useShallow((state) => state));

  const memoTypes = ["None", "Text", "ID", "Hash", "Return"];

  const [memoInput, setMemoInput] = useState<string>("");
  const [selectedMemoType, setSelectedMemoType] = useState<string>("");

  useEffect(() => {
    if (tx.tx.memo && typeof tx.tx.memo !== "string") {
      const memoValue = Object.values(tx.tx.memo)[0];
      setMemoInput(memoValue);
    } else {
      setMemoInput("");
    }
  }, [tx.tx.memo]);

  const handleMemoTypeChange = (type: string) => {
    if (type === "None") {
      setMemo("none");
    } else {
      setMemo({ [type.toLowerCase()]: memoInput });
    }
  };

  return (
    <div>
      <h4>Memo</h4>
      <div className="tabs" style={{width: "400px"}}>
        <div className="tabs-header">
          {memoTypes.map((type) => (
            <a
              className={`tabs-item condensed ${
                selectedMemoType === type && "selected"
              }`}
              href="#"
              key={type}
              onClick={(e) => {
                event?.preventDefault();
                handleMemoTypeChange(type);
                setSelectedMemoType(type);
              }}
            >
              <span className="tabs-item-text">{type}</span>
            </a>
          ))}
        </div>
      </div>
      {tx.tx.memo !== "none" && (
        <input
          placeholder={
            typeof tx.tx.memo === "object" && "text" in tx.tx.memo
              ? "UTF-8 string of up to 28 bytes"
              : typeof tx.tx.memo === "object" && "id" in tx.tx.memo
              ? "Unsigned 64-bit integer"
              : "32-byte hash in hexadecimal format (64 [0-9a-f] characters)"
          }
          value={memoInput}
          onChange={(e) => {
            setMemoInput(e.target.value);
            setMemo({ [Object.keys(tx.tx.memo)[0]]: e.target.value });
          }}
        />
      )}
    </div>
  );
};

export default MemoInput;
