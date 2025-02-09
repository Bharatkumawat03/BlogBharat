import express from "express";
import { userAuth } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { v2 as cloudinary } from "cloudinary";
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, upload.single("photoUrl"), async (req, res) => {
  try {
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_images",
        resource_type: "image",
      });
      loggedInUser.photoUrl = uploadedImage.secure_url;
    }
    
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName},  your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + err.message);
  }
});

export default profileRouter;
