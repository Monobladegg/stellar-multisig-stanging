import {
  IAccountsSlice,
  IBuildTxJSONSlice,
  INetSlice,
  IServerSlice,
  IThemeSlice,
} from "@/shared/types/store/slices";

interface Store
  extends INetSlice,
    IThemeSlice,
    IAccountsSlice,
    IBuildTxJSONSlice,
    IServerSlice {}

export default Store;
