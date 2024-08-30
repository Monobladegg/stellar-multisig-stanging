export interface IBuildTxJSONState {
  tx: TX
}

export interface TX {
  tx: {
    source_account: string;
    fee: number;
    seq_num: number;
    cond: {
      time: {
        min_time: number;
        max_time: number;
      };
    };
    memo:
      | "none"
      | {
          text?: string;
          id?: string;
          hash?: string;
          return?: string;
        };
    operations: IOperation[];
    ext: "v0"
  };
  signatures: ISignature[];
};

export interface IBuildTxJSONActions {
  setSourceAccount: (source_account: string) => void;
  setFee: (fee: number) => void;
  setSeqNum: (seq_num: number) => void;
  setTimeCondition: (min_time: number, max_time: number) => void;
  setMemo: (
    memo:
      | string
      | { text?: string; id?: string; hash?: string; return?: string }
  ) => void;
  addOperation: (operationType: "set_options" | "manage_data") => void;
  removeOperation: (index: number) => void;
  addSignature: (signature: ISignature) => void;
  removeSignature: (index: number) => void;
  resetTx: () => void;
  setOperations: (operations: IOperation[]) => void;
}

export interface ISignature {
  hint: string;
  signature: string;
}

export interface IOperation {
  source_account: string;
  body: {
    type: "set_options" | "manage_data";
    set_options?: {
      inflation_dest?: string;
      clear_flags?: number;
      set_flags?: number;
      master_weight?: number;
      low_threshold?: number;
      med_threshold?: number;
      high_threshold?: number;
      home_domain?: string;
      signer?:
        | {
            key?: string;
            weight?: number;
          }
        | undefined;
    };
    manage_data?: {
      data_name: string;
      data_value: string;
    };
  };
}

interface IBuildTxJSONSlice extends IBuildTxJSONState, IBuildTxJSONActions {}

export default IBuildTxJSONSlice;
