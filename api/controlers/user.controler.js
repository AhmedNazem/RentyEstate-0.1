import User from "../models/user.model.js";
import { errorHandler } from "../utls/error.js";
import bcryptjs from "bcryptjs";
//this file is the action of the user.route.js  most if the file conrollers work like that
export const test = (req, res) => {
  res.json({ message: "api tesitng :D" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only update your own account "));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          //?preview the code
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true } //?also here :D
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};
