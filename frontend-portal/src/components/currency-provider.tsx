import { createContext, useContext, useState, ReactNode } from "react";

type Currency = "KSH" | "USD" | "EUR" | "GBP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
}

const exchangeRates: Record<Currency, number> = {
  KSH: 1,
  USD: 0.0077,
  EUR: 0.0071,
  GBP: 0.0061,
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("KSH");

  const formatAmount = (amount: number): string => {
    const converted = amount * exchangeRates[currency];

    const formatters: Record<Currency, Intl.NumberFormat> = {
      KSH: new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", minimumFractionDigits: 0 }),
      USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
      EUR: new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }),
      GBP: new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }),
    };

    return formatters[currency].format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
