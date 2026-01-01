//----------------------- THIS FILE DEFINE CONNECTION BETWEEN 2 USERS ----------------------//

// Import mongoose
const mongoose = require("mongoose");

// Create schema
const connectionRequestSchema = new mongoose.Schema(
  {
    // Store the information of userId of sender
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // reference to the user collection
      required: true
    },

    // Store the information of userId of reciever
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      required: true,
      enum: {   // enum : {} => It is created for when we want the some restrict or certain value ("ignored", "interested", "accepted", "rejected")
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },

  // Time => When was the connection request send and when was accepted
  {
    timestamps: true,
  }
);

// Stop request if user sends request to themselves
connectionRequestSchema.pre("send", function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    return next(new Error("Cannot send connection request to yourself!"));
  }
  next();
});

// Create model
const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
