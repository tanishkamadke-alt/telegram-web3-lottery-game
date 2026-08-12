import { createContext, useContext } from "react";
import useTelegramHook from "../hooks/useTelegram";

const TelegramContext = createContext(null);

export function TelegramProvider({ children }) {
  console.log("✅ TelegramProvider rendered");

  const telegramUser = useTelegramHook();

  console.log("Telegram User from Provider:", telegramUser);

  return (
    <TelegramContext.Provider
      value={{
        telegramUser,
        insideTelegram: telegramUser !== null,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  return useContext(TelegramContext);
}