const express = require("express");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const User = require("../models/User");

/*
@route POST auth/register
@desc Register new user
@public access
*/
router.post("/register", async (req, res) => {
  const { username, password, email, fullname } = req.body;
  //validation
  if (!username || !password || !email || !fullname)
    return res
      .status(400)
      .json({ success: false, message: "Missing needed data from user!" });

  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "User already existed!" });

    //hash password before saving to db
    const hashedPassword = await argon2.hash(password);

    const newUser = new User({
      fullname,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    //sign token and return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY
    );

    return res.status(200).json({
      success: true,
      message: "Register new user successfully!",
      username,
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});

/*
@route POST auth/login
@desc Login user
@public access
 */

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password!" });
  }

  try {
    const existedUser = await User.findOne({ username });
    if (!existedUser)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });

    const isValidPassword = await argon2.verify(existedUser.password, password);
    if (!isValidPassword)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password!" });

    //return access token
    const accessToken = jwt.sign(
      { userId: existedUser._id },
      process.env.JWT_SECRET_KEY
    );

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      username,
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error " });
  }
});

/* 
@route GET auth/
@desc Check if user is logged in 
@public access
*/

router.get("/", verifyToken, async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});
module.exports = router;
