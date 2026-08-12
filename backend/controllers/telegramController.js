import { loginTelegramUser } from "../services/telegramService.js";

export const authenticateTelegramUser = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Telegram user data is required",
      });
    }

    const authenticatedUser = await loginTelegramUser(user);

    return res.status(200).json({
      success: true,
      message: "Telegram authentication successful",
      user: authenticatedUser,
    });

  } catch (error) {
  console.error("========== TELEGRAM AUTH ERROR ==========");
  console.error(error);
  console.error("Name:", error.name);
  console.error("Message:", error.message);
  console.error("Stack:", error.stack);

  return res.status(500).json({
    success: false,
    message: "Authentication failed",
  });
}
};