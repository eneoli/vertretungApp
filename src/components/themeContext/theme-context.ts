import React, {Context} from 'react';

export type ThemeType = 'light' | 'dark'

export interface ThemeContextAttributes {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const ThemeContext: Context<ThemeContextAttributes> = React.createContext({
  theme: 'light' as ThemeType, // default
  setTheme: (theme) => {
  },
});