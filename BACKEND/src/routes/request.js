const express = require("express");
const requestRouter = express.Router();

// Middleware
const { userAuth } = require("../middleware/auth");

// Models
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


// SEND CONNECTION REQUEST
// ROUTE → /request/send/:status/:toUserId
requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res, next) => {
    try {
        const fromUserId = req.user._id;  // who is sending the connection request
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // restricted into ignored and interested
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(404).json({ message: "Invalid status" });
        }

        // to prevent form the send request to yourself
        if (fromUserId.toString() === toUserId) {
            return next(new Error("You cannot send request to yourself!"));
        }

        // If there is an existing ConnectionRequest
        const existing = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existing) {
            return res.status(400).json({ message: "Request already exists!" });
        }

        // This is used to check the toUser exists
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Save the connection request
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();  // This connetcion request will save it into DB

        // Send the response back
        // req.user.firstName → the user who is sending the request
        // toUser.firstName → the user who receives the request
        res.json({
            message: `${req.user.firstName} is interested in ${toUser.firstName}`,
            data,
        });

    } catch (err) {
        next(err);
    }
});


// respond to connection request (accept and reject) - POST /request/review/:status/:fromUserId
requestRouter.post("/review/:status/:fromUserId", userAuth, async (req, res, next) => {
    const toUserId = req.user._id;   // ID of the user who is currently logged in
    const fromUserId = req.params.fromUserId;  // ID of the user who sent the connection request
    const status = req.params.status;   // New status to update the request with (accepted or rejected)

    // validating status
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
        res.status(404);
        res.json({ message: "Status must be either accepted or rejected." });
        return;
    }
    // checking if connection request exists
    const existingRequest = await ConnectionRequest.findOne({ fromUserId, toUserId });
    if (!existingRequest) {
        res.status(404);
        res.json({ message: "No connection request found from this user." });
        return;
    }
    // checking if the request has already been reviewed
    if (existingRequest.status === "accepted" || existingRequest.status === "rejected") {
        res.status(400);
        res.json({ message: "This connection request has already been reviewed." });
        return;
    }
    // checking if fromUserId exists
    const fromUser = await User.findById(fromUserId);
    if (!fromUser) {
        res.status(404);
        res.json({ message: "The user who sent the connection request does not exist." });
        return;
    }
    // preventing users from reviewing their own requests
    if (fromUserId.toString() === toUserId.toString()) {
        res.status(400);
        res.json({ message: "You cannot review your own connection request." });
        return;
    }
    // updating the connection request status
    try {
        existingRequest.status = status;
        await existingRequest.save();
        res.status(200);
        res.json({ message: "Connection request reviewed successfully", request: existingRequest });
        console.log(`Connection request from user ${User.findById(fromUserId).firstName} to user ${req.user.firstName} updated to status ${status} successfully...`);
    } catch (error) {
        res.status(500);
        res.json({ message: "Error reviewing connection request" });
    }
});

module.exports = requestRouter;
