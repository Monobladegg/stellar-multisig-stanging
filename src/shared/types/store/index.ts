import { IAccountsSlice, IBuildTxJSONSlice, INetSlice, IThemeSlice } from "@/shared/types/store/slices";

interface Store extends INetSlice, IThemeSlice, IAccountsSlice, IBuildTxJSONSlice {}

export default Store;