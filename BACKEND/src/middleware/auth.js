// // This file checks the JWT token, finds the user in the database,
// // and attaches the user to req.user so only logged-in users can access protected routes.

// // Importing JWT package to verify tokens
// const jwt = require("jsonwebtoken");

// // Importing User model to fetch user details from database
// const User = require("../models/user");

// // Middleware function to authenticate user
// const userAuth = async (req, res, next) => {
//     try {
//         // Step 1: Try extracting token from cookies
//         let token = req.cookies?.token;

//         // Step 2: If token not found in cookies, check "Authorization" header
//         if (!token) {
//             const authHeader = req.headers.authorization;

//             // Format should be:  Authorization: Bearer <token>
//             if (authHeader && authHeader.startsWith("Bearer ")) {
//                 // Extract token by removing "Bearer "
//                 token = authHeader.substring(7);
//             }
//         }

//         // Step 3: If still no token found → block the request
//         if (!token) {
//             throw new Error("Token is not valid");
//         }

//         // Step 4: Verify the token using the secret key
//         const decodedObj = await jwt.verify(token, "DEV@Tinder$790");

//         // Step 5: Extract user ID from decoded token
//         const { _id } = decodedObj;

//         // Step 6: Find user in the database with the decoded ID
//         const user = await User.findById(_id);

//         // Step 7: If user doesn't exist, throw error
//         if (!user) {
//             throw new Error("User not found");
//         }

//         // Step 8: Add user data to req.user so next route can access it
//         req.user = user;

//         // Step 9: Move to next middleware/route
//         next();
//     }
//     catch (err) {
//         // Step 10: If any error happens, send 401 Unauthorized
//         res.status(401).send("ERROR: " + err.message);
//     }
// };

// // Exporting middleware for use in other files
// module.exports = {
//     userAuth,
// };

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token not found");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { userAuth };
