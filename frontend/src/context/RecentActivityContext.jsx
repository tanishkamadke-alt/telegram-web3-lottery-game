import {
  useState,
  useEffect,
} from "react";

import { RecentActivityContext } from "./RecentActivity";
import socket from "../services/socket";
import { fetchRecentActivities } from "../services/activityService";

// Connect to backend Socket.IO server
export function RecentActivityProvider({ children }) {

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {

      async function loadActivities() {
        try {
          const activities = await fetchRecentActivities();
          console.log("Fetched Activities:", activities);
          console.log("Length:", activities.length);

          setRecentActivities(activities);
          console.log("Updated State:", activities);
        } catch (err) {
          console.error("Failed to load activities:", err);
        }
      }

    // Initial load
    (async () => {
      await loadActivities();
      })();

    // Listen for blockchain updates
    socket.on("activityUpdated", async () => {
      console.log("⚡ New blockchain activity received");
      await loadActivities();
    });

    return () => {
      socket.off("activityUpdated");
    };

  }, []);

  // Optional: add activity manually
  function addRecentActivity(activity) {

    setRecentActivities((prev) => [
      activity,
      ...prev,
    ].slice(0, 5));

  }

  function clearRecentActivities() {
    setRecentActivities([]);
  }

  return (
    <RecentActivityContext.Provider
      value={{
        recentActivities,
        addRecentActivity,
        clearRecentActivities,
      }}
    >
      {children}
    </RecentActivityContext.Provider>
  );
}





