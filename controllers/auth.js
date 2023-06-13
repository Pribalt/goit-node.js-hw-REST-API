const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const { User } = require("..//models/user");

const { HttpError, asyncWrapper, sendEmail } = require("../utils");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "..//", "public", "avatars");

const register = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
});

const verifyEmail = asyncWrapper(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw new HttpError(404, "Email not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({
    message: "Email verify success",
  });
});

const resendVerifyEmail = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email send success",
  });
});

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw new HttpError(401, "Email not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw new HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
  });
});

const getCurrent = asyncWrapper(async (req, res) => {
  const { email, name, subscription } = req.user;

  res.json({
    email,
    name,
    subscription,
  });
});

const logout = asyncWrapper(async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success",
  });
});

const updateSubscription = asyncWrapper(async (req, res) => {
  const { _id } = req.user;

  const updateUserSubscription = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  if (!updateUserSubscription) {
    throw new HttpError(404);
  }

  res.json(updateUserSubscription);
});

const updateAvatar = asyncWrapper(async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;

  const reworkedAvatar = await Jimp.read(tempUpload);
  reworkedAvatar.resize(250, 250).write(tempUpload);
  //   Jimp.read(tempUpload).then((image) => {
  //     return image.resize(250, 250).write(tempUpload);
  //   });

  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
});

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
};
