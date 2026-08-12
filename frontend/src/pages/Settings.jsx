import { useEffect, useState } from "react";
import { useTelegram } from "../context/TelegramContext";
import { useWallet } from "../context/WalletContext";
import {
  User,
  Wallet,
  ShieldCheck,
  Palette,
  Info,
} from "lucide-react";

import "./settings.css";

function Settings() {

  const { telegramUser } = useTelegram();

  const {
    walletAddress,
    connected,
    networkName,
    chainId,
  } = useWallet();

  return (

    <div className="settings-page">

      {/* Header */}

      <div className="settings-header">

        <h1>Settings</h1>

        <p>
          Manage your CipherDraw account and preferences
        </p>

      </div>

      {/* Grid */}

      <div className="settings-grid">

        {/* Account */}

        <div className="settings-section">

          <div className="section-title">

            <User size={22} />

            <h3>Account</h3>

          </div>

          <div className="setting-row">

            <span className="setting-label">
              Telegram
            </span>

            <span className="setting-value">

              {telegramUser
                ? telegramUser.first_name
                : "Not running in Telegram"}

            </span>

          </div>

          <div className="setting-row">

            <span className="setting-label">
              Username
            </span>

            <span className="setting-value">

              {telegramUser
                ? telegramUser.username
                  ? `@${telegramUser.username}`
                  : "No Username"
                : "Not running in Telegram"}

            </span>

          </div>

          <div className="setting-row">

            <span className="setting-label">
              Status
            </span>

            <span className="setting-value">

              {telegramUser
                ? "🟢 Telegram Verified"
                : "⚪ Not Verified"}

            </span>

          </div>

        </div>

        {/* Wallet */}

        <div className="settings-section">

          <div className="section-title">

            <Wallet size={22} />

            <h3>Wallet</h3>

          </div>

          <div className="setting-row">

            <span className="setting-label">
              Address
            </span>

            <span className="setting-value">

              {walletAddress
                ? `${walletAddress.substring(
                    0,
                    6
                  )}...${walletAddress.substring(
                    walletAddress.length - 4
                  )}`
                : "Not Connected"}

            </span>

          </div>

          <div className="setting-row">

            <span className="setting-label">
              Network
            </span>

            <span className="setting-value">

              {connected
                ? networkName
                : "No Network"}

            </span>

          </div>

          <div className="setting-row">

            <span className="setting-label">
              Chain ID
            </span>

            <span className="setting-value">

              {connected
                ? chainId
                : "-"}

            </span>

          </div>

          <div className="setting-row">

            <span className="setting-label">
              Status
            </span>

            <span className="setting-value">

              {connected
                ? "🟢 Connected"
                : "⚪ Disconnected"}

            </span>

          </div>

        </div>

        {/* Security */}

        <div className="settings-section">

          <div className="section-title">

            <ShieldCheck size={22} />

            <h3>Security</h3>

          </div>

          <div className="setting-row">

            <span className="setting-label">
              Telegram Authentication
            </span>

            <span className="setting-value">

              {telegramUser
                ? "🟢 Verified"
                : "⚪ Not Verified"}

            </span>

          </div>

          <div className="setting-row">

            <span className="setting-label">
              Wallet
            </span>

            <span className="setting-value">

              {connected
                ? "🟢 Connected"
                : "⚪ Disconnected"}

            </span>

          </div>

        </div>

        {/* Preferences */}

        <div className="settings-section">

          <div className="section-title">

            <Palette size={22} />

            <h3>Preferences</h3>

          </div>

          <div className="setting-row">

            <span>Theme</span>

            <span>Dark</span>

          </div>

          <div className="setting-row">

            <span>Notifications</span>

            <span>Enabled</span>

          </div>

        </div>

      </div>

      {/* About */}

      <div className="about-section">

        <div className="settings-section">

          <div className="section-title">

            <Info size={22} />

            <h3>About</h3>

          </div>

          <div className="setting-row">

            <span>Version</span>

            <span>v1.0.0</span>

          </div>

          <div className="setting-row">

            <span>Built With</span>

            <span>React • Solidity • Hardhat</span>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Settings;
