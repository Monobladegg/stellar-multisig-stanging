export interface ThemeState {
  theme: "day" | "night" | null
}

export interface ThemeActions {
  setTheme: (theme: string) => void
}

interface IThemeSlice extends ThemeState, ThemeActions {}

export default IThemeSlice
