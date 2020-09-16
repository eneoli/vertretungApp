import React, {Context} from 'react';

export type AppTheme = 'light' | 'dark'

export interface ThemeContextAttributes {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

export const ThemeContext: Context<ThemeContextAttributes> = React.createContext({
  theme: 'light' as AppTheme, // default
  setTheme: (theme) => {
  },
});