export type ThemeState = {
  theme: string
}

export type ThemeActions = {
  setTheme: (theme: string) => void
}

export type IThemeSlice = ThemeState & ThemeActions