import { createContext, useContext, useState, useEffect } from 'react'
import { THEMES } from '../data'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => localStorage.getItem('fnx_theme') || 'midnight')
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0]

  useEffect(() => {
    localStorage.setItem('fnx_theme', themeId)
    document.documentElement.style.setProperty('--teal', theme.primary)
    document.documentElement.style.setProperty('--bg', theme.bg)
    document.documentElement.style.setProperty('--surface', theme.surface)
  }, [themeId, theme])

  return (
    <ThemeContext.Provider value={{ theme, themeId, setThemeId, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
