// create a express router
const express = require("express");

// create authRouter => This router will handle user auth routes like signup and login
const authRouter = express.Router();

// To connect validation
const { validateSignUpData } = require("../utils/validation");

// To connect user model
const User = require("../models/user");

// importing bcrypt library for hashing passwords
const bcrypt = require("bcrypt");

// import jwt token
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middleware/auth");

// SIGNUP
authRouter.post("/signup", async (req, res) => {
    try {
        // VALIDATION OF DATA 
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;

        // ENCRYPT THE PASSWORD
        const passwordHash = await bcrypt.hash(password, 10);

        // Store the data
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User added successfully!!!");
    } catch (err) {
        res.status(401).send("ERROR :" + err.message);
    }
});

// LOGIN ROUTE
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(401).send("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid email or password");
        }

        // token generate
        const token = await user.getJWT();

        // ADD THIS PART ↓↓↓
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        // ↑↑↑ VERY IMPORTANT

        res.status(200).json({
            message: "Login Successfully!!",
            token,
        });
    } catch (err) {
        res.status(500).send("ERROR: " + err.message);
    }
});



// LOGOUT: Remove the token cookie immediately to log the user out
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout successful");
});

module.exports =  authRouter;
