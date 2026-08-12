import User from "../models/User.js";

export const loginTelegramUser = async (telegramUser) => {
  const {
    id,
    first_name,
    last_name,
    username,
    photo_url,
  } = telegramUser;

  console.log("STEP 1: Before findOne");

  let user = await User.findOne({ telegramId: id });

  console.log("STEP 2: After findOne");

  if (!user) {
    console.log("STEP 3: Before create");

    user = await User.create({
      telegramId: id,
      firstName: first_name,
      lastName: last_name,
      username,
      photoUrl: photo_url,
    });

    console.log("STEP 4: After create");
  }

  return user;
};