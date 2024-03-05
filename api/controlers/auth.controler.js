import User from "../models/user.model.js"; //? db model
import bcryptjs from "bcryptjs"; //?encrybtion
import { errorHandler } from "../utils/error.js"; //? err handler
import jwt from "jsonwebtoken"; //? cookies auth

export const signup = async (req, res, next) => {
  //? next for make a middleware
  const { username, email, password } = req.body; //? taking it from the sign up page .jsx
  const hashedPassword = bcryptjs.hashSync(password, 10); //? hashing the password using bctyptjs
  const newUser = new User({ username, email, password: hashedPassword }); //? create the user data
  try {
    await newUser.save(); //? then save it
    res.status(201).json("User created successfully!"); //? stauts code 201 means somthing new add it to th DB
  } catch (error) {
    next(error); //? catching the error
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body; //? same here but we don't need the username
  try {
    const validUser = await User.findOne({ email }); //? check if i have alredy account to sign in to it
    if (!validUser) return next(errorHandler(404, "User not found!")); // ? if i don't return 404 and the message
    const validPassword = bcryptjs.compareSync(password, validUser.password); //? here if we need to cmpare the hashed password i need to use compareSync
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!")); //? sent 401 unauthrized
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); // ? here we used the JWT method that create new token for every user founded that take the id of the user to know who has this token then put the jwt message key in .env file
    const { password: pass, ...rest } = validUser._doc; //? way to keep the password outside the user seen (in the inspect tokent )
    res
      .cookie("access_token", token, { httpOnly: true }) //?name the cookie and its value then type off protocole
      .status(200)
      .json(rest); //?  here we sent only rest to keep the password secret
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc; //? return all info exept password
      res
        .cookie("access_token", token, { httpOnly: true }) //? httpOnly: true   to incress the secure
        .status(200)
        .json(rest);
    } else {
      //? because our app is requre the password  while we used google oauth we need to generate random password
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); //? way to generate random password
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() + //? formula for make the name standard in the site
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo, //? take the google account photo
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token"); // ? clearing the cookie in the applecation
    res.status(200).json("User has been logged out !");
  } catch (err) {
    next(err);
  }
};
