import express from "express";
import {
  google,
  signOut,
  signin,
  signup,
} from "../controlers/auth.controler.js";
const route = express.Router();
route.post("/signup", signup);
route.post("/signin", signin);
route.post("/google", google);
route.get("/signout", signOut);
export default route;
