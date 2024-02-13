import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utls/error.js";
import jwt from "jsonwebtoken";
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashpassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashpassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "user create successfully" });
  } catch (error) {
    next(error);
  }
};
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "user not found :( "));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "invalid password "));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    // This technique is often used when you want to exclude certain properties
    //from an object for security or privacy reasons,
    // especially when sending data to clients or
    // other parts of your application.
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (err) {
    next(err);
  }
};
//need to understand some part of the function
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      // Destructure the user object, excluding the password
      //because of excluding the password  and the model of the db require a password we need to create random password
      const { password: pass, ...rest } = user._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      //createing the random password
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      //random nums are always have zero and dots so  we need only the number after this dot  by use slice method
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo, //! undetected bug
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (err) {
    next(err);
  }
};
