import { useEffect, useState } from "react";
import {
  initializeTelegram,
  getTelegramUser,
  authenticateTelegramUser,
} from "../services/telegram";

export default function useTelegramHook() {
  const [telegramUser, setTelegramUser] = useState(null);

useEffect(() => {
  
  const tg = initializeTelegram();

  if (tg) {
    const user = getTelegramUser();

    setTelegramUser(user);

    if (user) {
      authenticateTelegramUser(user)
        .then((response) => {
          console.log("Authentication Response:", response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
}, []);

  return telegramUser;
}