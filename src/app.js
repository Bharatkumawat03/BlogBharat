import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', "PATCH", 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    })
)

app.use(cookieParser());
app.use(express.json());

import authRouter from './routes/auth.js';
import blogRouter from './routes/blog.js';
import profileRouter from './routes/profile.js';

app.use("/", authRouter);
app.use("/", blogRouter);
app.use("/", profileRouter);

connectDB()
.then(() => {
    app.get("/", (req, res) => {
        res.send("API WORKING");
    });
    console.log("Database connected");
    connectCloudinary();
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.error("Database cannot be connected!!");
})