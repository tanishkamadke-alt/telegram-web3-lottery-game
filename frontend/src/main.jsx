import ReactDOM from "react-dom/client";
import "./config/walletConnect";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./styles/globals.css";

import { WalletProvider } from "./context/WalletContext";
import { TelegramProvider } from "./context/TelegramContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <TelegramProvider>
    <WalletProvider>
      <App />

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3500,
          style: {
            background: "#1E2743",
            color: "#ffffff",
            border: "1px solid #00E5FF",
          },
          success: {
            iconTheme: {
              primary: "#00E676",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#FF5252",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </WalletProvider>
  </TelegramProvider>
);
