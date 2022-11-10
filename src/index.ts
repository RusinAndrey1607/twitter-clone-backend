import { profileRouter } from "./routes/profileRouter";
import { dbConnect } from "./db/sequelize";
import cors from "cors";
import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/authRouter";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { tweetRouter } from "./routes/tweetRouter";
import { commentRouter } from "./routes/commentRouter";

config();

const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/tweet", tweetRouter);
app.use("/comment", commentRouter);
app.use(errorMiddleware);

const start = async () => {
  try {
    await dbConnect();

    app.listen(port, () => {
      console.log("Server working on a port", port);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
