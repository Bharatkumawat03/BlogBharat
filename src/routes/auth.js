import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { validateSignUpData } from '../utils/validation.js';

const authRouter = express.Router();

authRouter.post("/signup", async (req,res) => {
    try {
        validateSignUpData(req);

        const {firstName, lastName, email, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 8 ),
            httpOnly: true,
            secure: true,
            sameSite: "None",
        })

        res.status(201).json({message: "User Added successfully!", data: savedUser});
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({message: "Invalid Email"});
        }

        const isValidPassword = await user.validatePassword(password);
        if(isValidPassword){
            const token = await user.getJWT();
            
            res.cookie("token", token, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 8 ),
                httpOnly: true,
                secure: true,
                sameSite: "None",
            })
            res.status(200).json({ message: "Login successful", data: user });
            // res.send(user);
        } else {
            return res.status(401).json({message: "Invalid Password"});
        }
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
});

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null,{
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "None",
        })
        res.status(200).json({message: "Logged out successfully!"});
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
})

export default authRouter;