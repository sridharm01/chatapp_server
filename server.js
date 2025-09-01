import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/useRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import User from "./models/User.js";

dotenv.config();

const app=express();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("MongoDB Connected");
  try {
    const userCount = await User.countDocuments();
    console.log(`Successfully performed a test query. Total users: ${userCount}`);
  } catch (testError) {
    console.error("Error during test query:", testError);
  }
})
.catch((err)=>{console.log(err)})

app.get("/test", (req, res) => {
  console.log("Test route hit!");
  res.status(200).send("Test route is working!");
});

app.use("/api/users",userRoutes);
app.use("/api/auth", authRoutes);

app.listen(5000, '0.0.0.0', ()=>{console.log("Server running on Port 5000")})