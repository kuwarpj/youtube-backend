import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//Routes import

import userRouter from './routes/user.rt.js'
import { ApiError } from "./utils/apiError.js";



app.use("/api/v1/user", userRouter)





app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }

  console.error("Unhandled Error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;

