import {
  IAccountsSlice,
  IBuildErrorsSlice,
  IBuildTxJSONSlice,
  INetSlice,
  IServerSlice,
  IThemeSlice,
  ITransactionsFromFirebaseSlice,
  ICollapsesBlocksSlice,
  IInformationSlice,
  IModalsSlice,
} from "./slices";

interface Store
  extends INetSlice,
    IThemeSlice,
    IAccountsSlice,
    IBuildTxJSONSlice,
    IServerSlice,
    ITransactionsFromFirebaseSlice,
    IBuildErrorsSlice,
    ICollapsesBlocksSlice,
    IInformationSlice,
    ICollapsesBlocksSlice,
    IModalsSlice {}

export default Store;
