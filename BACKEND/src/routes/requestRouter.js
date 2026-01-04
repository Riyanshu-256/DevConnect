const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

/* =====================================================
   SEND CONNECTION REQUEST
   POST /request/send/:status/:toUserId
===================================================== */
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { status, toUserId } = req.params;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status type" });
      }

      if (fromUserId.toString() === toUserId) {
        return res
          .status(400)
          .json({ message: "You cannot send request to yourself" });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exists" });
      }

      const connectionRequest = await ConnectionRequest.create({
        fromUserId,
        toUserId,
        status,
      });

      res.status(200).json({
        message: `Request ${status} successfully`,
        data: connectionRequest,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* =====================================================
   GET RECEIVED CONNECTION REQUESTS
   GET /user/request/received
===================================================== */
requestRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const requests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName emailId photoUrl age gender skills about"
    );

    res.json({
      message: "Received connection requests",
      data: requests,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* =====================================================
   GET SENT CONNECTION REQUESTS
   GET /user/request/sent
===================================================== */
requestRouter.get("/user/request/sent", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const sentRequests = await ConnectionRequest.find({
      fromUserId: loggedInUserId,
    }).populate(
      "toUserId",
      "firstName lastName photoUrl age gender skills about"
    );

    res.json({
      message: "Sent connection requests",
      data: sentRequests,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =====================================================
   REVIEW CONNECTION REQUEST (ACCEPT / REJECT)
   POST /request/review/:status/:requestId
===================================================== */
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status not allowed",
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: `Connection request ${status}`,
        data,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

/* =====================================================
   GET ACCEPTED CONNECTIONS (NEW + REQUIRED)
   GET /user/connections
===================================================== */
requestRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    })
      .populate(
        "fromUserId",
        "firstName lastName photoUrl age gender skills about"
      )
      .populate(
        "toUserId",
        "firstName lastName photoUrl age gender skills about"
      );

    // return only the OTHER user
    const users = connections.map((req) =>
      req.fromUserId._id.toString() === loggedInUserId.toString()
        ? req.toUserId
        : req.fromUserId
    );

    res.json({
      message: "Connections fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = requestRouter;
