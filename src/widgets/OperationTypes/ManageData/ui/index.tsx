import React, { FC, ChangeEvent } from "react";
import s from "@/widgets/OperationTypes/index.module.scss";
import InputField from "@/widgets/OperationTypes/shared/InputField";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";
import { stringToHex, hexToString } from "@/pages/public/BuildTransaction/page";
import StellarSdk from "stellar-sdk";
import { IOperation } from "@/shared/types/store/slices";

interface Props {
  id: number;
}

const ManageData: FC<Props> = ({ id }) => {
  const { tx, setOperations } = useStore(
    useShallow((state) => ({
      tx: state.tx,
      setOperations: state.setOperations,
    }))
  );

  const operation = tx.tx.operations[id] as IOperation;
  const entryName = operation.body.manage_data?.data_name || "";
  const entryValue = operation.body.manage_data?.data_value || "";
  const sourceAccount = operation.source_account || "";

  const validateSymbols = (value: string): boolean => value.length <= 64;

  const handleEntryNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newOperations = [...tx.tx.operations];
    newOperations[id] = {
      ...newOperations[id],
      body: {
        ...newOperations[id].body,
        manage_data: {
          ...newOperations[id].body.manage_data,
          data_name: event.target.value,
        },
      },
    };
    setOperations(newOperations);
  };

  const handleEntryValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newOperations = [...tx.tx.operations];
    newOperations[id] = {
      ...newOperations[id],
      body: {
        ...newOperations[id].body,
        manage_data: {
          ...newOperations[id].body.manage_data,
          data_value: stringToHex(event.target.value),
        },
      },
    };
    setOperations(newOperations);
  };

  const handleSourceAccountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newOperations = [...tx.tx.operations];
    newOperations[id] = {
      ...newOperations[id],
      source_account: event.target.value,
    };
    setOperations(newOperations);
  };

  return (
    <>
      <p>Sets, modifies, or deletes a Data Entry (name/value pair).</p>
      <hr />
      <div className={s.main}>
        <InputField
          title="Entry Name"
          placeholder="Enter entry name"
          value={entryName}
          onChange={handleEntryNameChange}
          validate={validateSymbols}
          errorMessage={`Entry name can only contain a maximum of 64 characters. ${entryName.length} characters.`}
          isOptional={false}
        />
        <InputField
          title="Entry Value (Optional)"
          placeholder="Enter optional entry value"
          value={hexToString(entryValue)}
          onChange={handleEntryValueChange}
          validate={validateSymbols}
          warningMessage="If empty, this will delete the data entry named in this operation. Note: The Lab only supports strings."
          errorMessage={`Entry value can only contain a maximum of 64 characters. ${hexToString(entryValue).length} characters.`}
        />
        <InputField
          title="Source Account"
          placeholder="Example: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6"
          value={sourceAccount}
          onChange={handleSourceAccountChange}
          validate={(value) => StellarSdk.StrKey.isValidEd25519PublicKey(value) || value === ""}
          errorMessage="Public key is invalid."
        />
      </div>
    </>
  );
};

export default ManageData;
