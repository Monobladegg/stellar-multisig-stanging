import { IThemeSlice } from "@/shared/types/store/slices";
import { StateCreator } from "zustand";

export const themeSlice: StateCreator<
  IThemeSlice,
  [["zustand/immer", never]],
  [],
  IThemeSlice
> = (set/*, get*/) => {
  const theme = typeof localStorage !== "undefined" ? localStorage.getItem("theme") || "night" : "night";

  return {
    theme,
    setTheme: (theme: string) => {
      set({ theme: theme });
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("theme", theme);
      }
    },
  };
};
