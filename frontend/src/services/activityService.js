const API_URL =
  `${import.meta.env.VITE_BACKEND_URL}/api/activity`;

// Leaderboard
export const fetchActivities = async () => {
  try {
    const response = await fetch(API_URL);

    const data = await response.json();
    console.log("API returned:", data);

    return data.activities || [];
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return [];
  }
};

// Activity Centre
export const fetchRecentActivities = async () => {
  try {
    const response = await fetch(`${API_URL}/recent`);

    const data = await response.json();

    return data.activities || [];
  } catch (error) {
    console.error("Failed to fetch recent activities:", error);
    return [];
  }
};