// create a express router
const express = require("express");

// create a profileRouter which handles user profile like view, edit, password
const profileRouter = express.Router();

// To connect with userAuth
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

// PROFILE VIEW ROUTE (JWT Protected)
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("ERROR : " + err.message);
  }
});

// PROFILE EDIT ROUTE (JWT Protected)
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {

    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });

  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
