const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');


require("dotenv").config();
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

const authRouter = require('./routes/auth');

app.use("/", authRouter);

connectDB()
.then(() => {
    app.get("/", (req, res) => {
        res.send("API WORKING");
    });
    console.log("Database connected");
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.error("Database cannot be connected!!");
})