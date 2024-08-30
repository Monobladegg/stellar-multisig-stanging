"use client";

import React, { useState, FC, useCallback } from "react";
import FlagSelector from "../../shared/FlagSelector";
import { setFlagsData, clearFlagsData } from "./flagsData";
import s from "@/widgets/OperationTypes/index.module.scss";
import StellarSdk from "stellar-sdk";
import InputField from "../../shared/InputField";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";

export const signerOptions: string[] = [
  "Select signer type",
  "Ed25519 Public Key",
  "sha256 Hash",
  "Pre-authorized Transaction Hash",
];

export interface Props {
  id: number;
}

const SetOptions: FC<Props> = ({id}) => {
  const {
    tx,
    setOperations,
  } = useStore(useShallow((state) => state));

  const operation = tx.tx.operations[id]
  const inflationDestination = operation.body.set_options?.inflation_dest || "";
  const masterWeight = operation.body.set_options?.master_weight || "";
  const lowThreshold = operation.body.set_options?.low_threshold || "";
  const mediumThreshold = operation.body.set_options?.med_threshold || "";
  const highThreshold = operation.body.set_options?.high_threshold || "";
  const homeDomain = operation.body.set_options?.home_domain || "";
  const sourceAccount = tx.tx.operations[id]?.source_account || "";

  const [selectedSetFlags, setSelectedSetFlags] = useState<number[]>([]);
  const [selectedClearFlags, setSelectedClearFlags] = useState<number[]>([]);
  const [currentSignerType, setCurrentSignerType] = useState<string>(signerOptions[0]);

  // Set Flags
  const handleToggleSetFlag = useCallback((flagId: number) => {
    setSelectedSetFlags((prevFlags) =>
      prevFlags.includes(flagId)
        ? prevFlags.filter((id) => id !== flagId)
        : [...prevFlags, flagId]
    );
  }, []);

  // Clear Flags
  const handleToggleClearFlag = useCallback((flagId: number) => {
    setSelectedClearFlags((prevFlags) =>
      prevFlags.includes(flagId)
        ? prevFlags.filter((id) => id !== flagId)
        : [...prevFlags, flagId]
    );
  }, []);

  const validateRange = useCallback((value: string): boolean => {
    const num = Number(value);
    return num >= 0 && num <= 255;
  }, []);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOperations = [...tx.tx.operations];
    if (newOperations[id]) {
      newOperations[id] = {
        ...newOperations[id],
        body: {
          ...newOperations[id].body,
          set_options: {
            ...newOperations[id].body.set_options,
            [field]: e.target.value
          }
        }
      };
      setOperations(newOperations);
    }
  };

  return (
    <>
      <p>Sets various configuration options for an account.</p>
      <hr />
      <div className={s.main}>
        <InputField
          title="Inflation Destination"
          placeholder="Example: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6"
          value={inflationDestination}
          onChange={handleInputChange('inflation_dest')}
          validate={(value) => StellarSdk.StrKey.isValidEd25519PublicKey(value) || value === ""}
          errorMessage="Public key is invalid."
        />

        <FlagSelector
          title="Set Flags"
          flags={setFlagsData}
          selectedFlags={selectedSetFlags}
          onToggle={handleToggleSetFlag}
        />

        <FlagSelector
          title="Clear Flags"
          flags={clearFlagsData}
          selectedFlags={selectedClearFlags}
          onToggle={handleToggleClearFlag}
        />

        <InputField
          title="Master Weight"
          placeholder="0-255"
          value={masterWeight.toString()}
          onChange={handleInputChange('master_weight')}
          validate={validateRange}
          errorMessage="Expected an integer between 0 and 255 (inclusive)."
          warningMessage="This can result in a permanently locked account. Are you sure you know what you're doing?"
        />

        <InputField
          title="Low Threshold"
          placeholder="0-255"
          value={lowThreshold.toString()}
          onChange={handleInputChange('low_threshold')}
          validate={validateRange}
          errorMessage="Expected an integer between 0 and 255 (inclusive)."
        />

        <InputField
          title="Medium Threshold"
          placeholder="0-255"
          value={mediumThreshold.toString()}
          onChange={handleInputChange('med_threshold')}
          validate={validateRange}
          errorMessage="Expected an integer between 0 and 255 (inclusive)."
          warningMessage="This can result in a permanently locked account. Are you sure you know what you're doing?"
        />

        <InputField
          title="High Threshold"
          placeholder="0-255"
          value={highThreshold.toString()}
          onChange={handleInputChange('high_threshold')}
          validate={validateRange}
          errorMessage="Expected an integer between 0 and 255 (inclusive)."
          warningMessage="This can result in a permanently locked account. Are you sure you know what you're doing?"
        />

        <div className={s.section}>
          <h4 className={s.sectionTitle}>
            Signer Type <span className={s.optional}>(optional)</span>
          </h4>
          <div>
            <select
              className={s.selectCurrentSignerType}
              value={currentSignerType}
              onChange={(e) => setCurrentSignerType(e.target.value)}
            >
              {signerOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <p>
              Used to add/remove or adjust the weight of an additional signer on the account.
            </p>
          </div>
        </div>

        <InputField
          title="Home Domain"
          placeholder="Example: example.com"
          value={homeDomain}
          onChange={handleInputChange('home_domain')}
        />

        <InputField
          title="Source Account"
          placeholder="Example: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6"
          value={sourceAccount}
          onChange={handleInputChange('source_account')}
          validate={(value) => StellarSdk.StrKey.isValidEd25519PublicKey(value) || value === ""}
          errorMessage="Public key is invalid."
        />
      </div>
    </>
  );
};

export default SetOptions;