export type NetState = {
  net: string
}

export type NetActions = {
  setNet: (net: string) => void
}

export type INetSlice = NetState & NetActions