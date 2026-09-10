import Activity from "../models/Activity.js";

// All activities (Leaderboard)
export const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
    });
  }
};

// Latest 10 activities (Activity Centre)
export const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
    });
  }
};