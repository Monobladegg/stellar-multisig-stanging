import {
  IAccountsSlice,
  IBuildErrorsSlice,
  IBuildTxJSONSlice,
  INetSlice,
  IServerSlice,
  IThemeSlice,
  ITransactionsFromFirebaseSlice,
  ICollapsesBlocksSlice,
  IInformationSlice
} from "./slices";

interface Store
  extends INetSlice,
    IThemeSlice,
    IAccountsSlice,
    IBuildTxJSONSlice,
    IServerSlice,
    ITransactionsFromFirebaseSlice,
    IBuildErrorsSlice,
    ICollapsesBlocksSlice, IInformationSlice {}

export default Store;
