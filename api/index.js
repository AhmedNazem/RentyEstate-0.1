//all router files are connected straght to this file but controllers are connected first with routes :D
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import UserRoute from "./routers/user.route.js";
import authRouter from "./routers/auth.route.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routers/listing.route.js";
import path from "path";
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("successfully conected to database"))
  .catch((err) => console.log(err));
const _dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(cookieParser()); //? go some search about it
app.listen(3000, () => {
  console.log("app is running on port 3000 ");
});
app.use("/api/user", UserRoute);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(_dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "client", "dist", "index.html"));
});

//* creating a moddleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || "500";
  const message = err.message || "internal server error ";
  return res.status(statusCode).json({
    succsess: false,
    statusCode,
    message,
  });
});
