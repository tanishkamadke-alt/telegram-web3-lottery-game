import { useState } from "react";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import ActivityCentre from "./pages/ActivityCentre";
import Manager from "./pages/Manager";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import Analytics from "./pages/Analytics";
import Leaderboard from "./pages/Leaderboard";
import { useTelegram } from "./context/TelegramContext";

function App() {
  const [page, setPage] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);

  const { telegramUser, insideTelegram } = useTelegram();

  function refreshBlockchainData() {
    setRefreshKey((prev) => prev + 1);
  }

  let pageComponent;

  switch (page) {
    case "activity":
      pageComponent = (
        <ActivityCentre
          refreshKey={refreshKey}
        />
      );
      break;

    case "manager":
      pageComponent = (
        <Manager
          refreshBlockchainData={refreshBlockchainData}
        />
      );
      break;
    
    case "statistics":
      pageComponent = (
        <Statistics
            refreshKey={refreshKey}
        />
      );
      break;  

    case "analytics":
      pageComponent = (
        <Analytics
          refreshKey={refreshKey}
        />
      );
      break;  

    case "leaderboard":
      pageComponent = (
        <Leaderboard
        refreshKey={refreshKey}
      />
      );
      break;  

    case "settings":
      pageComponent = <Settings />;
      break;

    default:
      pageComponent = (
        <Dashboard
          refreshKey={refreshKey}
          refreshBlockchainData={refreshBlockchainData}
          setPage={setPage}
        />
      );
      break;
  }

  if (import.meta.env.DEV) {
    console.log("App rendered");
    console.log("Telegram User:", telegramUser);
    console.log("Inside Telegram:", insideTelegram);
  }

  return (
    <MainLayout
      page={page}
      setPage={setPage}
    >
      {pageComponent}
    </MainLayout>
  );
}

export default App;
