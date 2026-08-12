let webApp = null;

export function initializeTelegram() {
  if (!window.Telegram?.WebApp) {
    
    return null;
  }

  webApp = window.Telegram.WebApp;

  
  console.log("initData:", webApp.initData);
  

  webApp.ready();
  webApp.expand();

  return webApp;
}

export function getTelegramUser() {
  if (!webApp) return null;
  return webApp.initDataUnsafe?.user || null;
}

export function isTelegram() {
  return !!window.Telegram?.WebApp;
}

export async function authenticateTelegramUser(user) {
  try {
    const response = await fetch("http://localhost:5000/api/auth/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });

    return await response.json();
  } catch (error) {
    console.error("Authentication Error:", error);
    return null;
  }
}