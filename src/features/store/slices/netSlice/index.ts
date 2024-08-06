import { INetSlice } from "@/shared/types/Store/Slices/NetSlice";
import { StateCreator } from "zustand";

export const netSlice: StateCreator<
  INetSlice,
  [["zustand/immer", never]],
  [],
  INetSlice
> = (set/*, get*/) => {
  const net = "public";
  const setNet = (net: string) => {
    set({ net: net }); 
    localStorage.setItem("net", net);    
  }
  
  return {
    net,
    setNet
  };
};
