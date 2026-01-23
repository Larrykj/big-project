import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "./components/theme-provider"
import { CurrencyProvider } from "./components/currency-provider"
import { AuthProvider } from "./components/auth-provider"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <CurrencyProvider>
          <App />
        </CurrencyProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)
