import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("successfully conected to database"))
  .catch((err) => console.log(err));
const app = express();

app.listen(3000, () => {
  console.log("app is running on port 3000 ");
});
