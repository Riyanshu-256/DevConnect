// Import express
const express = require("express");

// Import userAuth middleware (to protect routes using JWT)
const { userAuth } = require("../middleware/auth");

// Import ConnectionRequest model
const ConnectionRequest = require("../models/connectionRequest");

// Import User model
const User = require("../models/user");

// Create a router for all user-related routes
const userRouter = express.Router();

// Safe fields that we can show publicly for a user
const USER_SAFE_DATA = "firstName lastName age gender about skills photoUrl";


// ======================================================================================================================== //
// 1. GET all pending connection requests received by the logged-in user
// Route → GET /user/request/received
// Protected route → Only logged-in users can access (userAuth)
userRouter.get("/user/request/received", userAuth, async (req, res) => {

    try {
        // Currently logged-in user
        const loggedInUser = req.user;

        // Find all requests sent *to* the logged-in user with status = "interested"
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        })
        // Populate only selected fields of the user who sent the request
        .populate("fromUserId", ["firstName", "lastName", "photoUrl", "age"]);

        // Send response
        res.json({
            message: "Data fetched successfully",
            data: connectionRequest,
        });

    } catch (err) {
        // If error occurs
        res.status(404).send("ERROR: " + err.message);
    }
});


// ======================================================================================================================== //
// 2. GET all connected (accepted) users
// Route → GET /user/connections
userRouter.get("/user/connections", userAuth, async (req, res) => {

    // Logged-in user's ID
    const userId = req.user._id;

    try {
        // Find all accepted connection requests where:
        // - logged-in user sent request OR
        // - logged-in user received request
        const acceptedRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: userId, status: "accepted" },
                { toUserId: userId, status: "accepted" },
            ],
        })
        // Populate both sender and receiver user details
        .populate("fromUserId toUserId", USER_SAFE_DATA);

        // Extract only the other person's data
        const connections = acceptedRequests.map((request) => {
            // If logged-in user is sender → return receiver
            return request.fromUserId._id.toString() === userId.toString()
                ? request.toUserId
            // Else return sender
                : request.fromUserId;
        });

        // If no connections found
        if (connections.length === 0) {
            res.json({ message: "No connected users found." });
            return;
        }

        // Success response
        res.json({
            message: "Connected users fetched successfully",
            connections,
        });

    } catch (error) {
        // Error response
        res.status(500).json({
            message: "Error fetching connected users",
            error: error.message,
        });
    }
});


// ======================================================================================================================== //
// 3. FEED API (Show users excluding blocked, requested, rejected, accepted users)
// Note: User should see all the cards except
// 1. his own card
// 2. his connection request
// 3. ignored people
// 4. already the send the connection request

// Example: [R, A, B, C, D, E] => R -> A and R => E => Accepted
// R => A (REJECTED)    R => C(accepted)
// R shows the card => [A, B, D, E]

// Route → GET /feed?page=1&limit=10
userRouter.get("/feed", userAuth, async (req, res) => {

    try {
        // Logged-in user
        const loggedInUser = req.user;

        // Pagination settings
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        // Limit should not exceed 50
        limit = limit > 50 ? 50 : limit;

        // Skip users based on pagination
        const skip = (page - 1) * limit;

        // Find all connection requests involving the logged-in user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ],
        }).select("fromUserId toUserId");

        // Create a set of all users that should NOT appear in feed
        const hideUsersFromFeed = new Set();

        // Add both sender and receiver IDs to the hidden list
        connectionRequests.forEach((reqData) => {
            hideUsersFromFeed.add(reqData.fromUserId.toString());
            hideUsersFromFeed.add(reqData.toUserId.toString());
        });

        // Find all users EXCEPT:
        // 1. Logged-in user
        // 2. Users who are already sent/received requests
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        })
        // Select only safe fields
        .select(USER_SAFE_DATA)
        // Pagination
        .skip(skip)
        .limit(limit);

        // Send feed data
        res.json({ data: users });

    } catch (err) {
        // Error response
        res.status(404).json({ message: err.message });
    }
});

// Export router
module.exports = userRouter;