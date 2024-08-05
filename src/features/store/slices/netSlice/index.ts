import { INetSlice } from "@/shared/types/store/slices";
import { StateCreator } from "zustand";

export const netSlice: StateCreator<
  INetSlice,
  [["zustand/immer", never]],
  [],
  INetSlice
> = (set/*, get*/) => {
  const net = typeof localStorage !== "undefined" ? localStorage.getItem("net") || "public" : "public";

  return {
    net,
    setNet: (net: string) => {
      set({ net: net });
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("net", net);
      }
    },
  };
};
