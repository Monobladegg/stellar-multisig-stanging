import { IBuildTxJSONSlice } from "@/shared/types/store/slices";
import { StateCreator } from "zustand";
import { IOperation, ISignature } from "@/shared/types/store/slices";
import { TX } from "@/shared/types/store/slices/buildTxJSONSlice";

type ImmerStateCreator<T> = StateCreator<T, [["zustand/immer", never]], [], T>;

export const buildTxJSONSlice: ImmerStateCreator<IBuildTxJSONSlice> = (set) => {
  const initialTx: TX = {
    tx: {
      source_account: "",
      fee: 0,
      seq_num: 0,
      cond: {
        time: {
          min_time: 0,
          max_time: 0,
        },
      },
      memo: "none",
      operations: [] as IOperation[],
      ext: "v0"
    },
    signatures: [] as ISignature[],
  };

  return {
    tx: initialTx,
    setSourceAccount: (source_account: string) =>
      set((state) => {
        state.tx.tx.source_account = source_account;
      }),
    setFee: (fee: number) =>
      set((state) => {
        state.tx.tx.fee = fee;
      }),
    setSeqNum: (seq_num: number) =>
      set((state) => {
        state.tx.tx.seq_num = seq_num;
      }),
    setTimeCondition: (min_time: number, max_time: number) =>
      set((state) => {
        state.tx.tx.cond.time.min_time = min_time;
        state.tx.tx.cond.time.max_time = max_time;
      }),
    setMemo: (
      memo:
        | "none"
        | { text?: string; id?: string; hash?: string; return?: string }
    ) =>
      set((state) => {
        state.tx.tx.memo = memo;
      }),
    setOperations: (operations: IOperation[]) =>
      set((state) => {
        state.tx.tx.operations = operations;
      }),
    addOperation: (operationType: "set_options" | "manage_data") =>
      set((state) => {
        state.tx.tx.operations.push({
          source_account: state.tx.tx.source_account,
          body: {
            type: operationType,
            [operationType]: {} as IOperation["body"][typeof operationType],
          },
        });
      }),
    removeOperation: (index: number) =>
      set((state) => {
        state.tx.tx.operations.splice(index, 1);
      }),
    addSignature: (signature: ISignature) =>
      set((state) => {
        state.tx.signatures.push(signature);
      }),
    removeSignature: (index: number) =>
      set((state) => {
        state.tx.signatures.splice(index, 1);
      }),
    resetTx: () =>
      set(() => ({
        tx: initialTx,
      })),
  };
};
