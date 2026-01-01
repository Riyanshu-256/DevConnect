const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Create user schema => A design plan for how your documents should be stored
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,  // user must give their firstName otherwise mongoose doesn't allow the insertion  in the database
        minLength: 5,
        maxLength: 35
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,   // user must login with emailId
        unique: true,    // emailid must be unique
        lowercase: true,   // convert upper case into lower case
        trim: true,    // To avoid wide spaces
    },
    password: {
        type: String
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: {  // enum : {} => restricted for some values
            values: ["male", "female", "others"],
            message: `{VALUE} is not a gender type`
        }
    },
    photoUrl: {
        type: String,
    },
    about: {
        type: String,
        default: "This is the default about of the user"
    },
    skills: {
        type: [String],    // array of skills
    }
},
{
    timestamps: true   // MongoDB will automatically add when the data was created and when it was last updated.
});

// Adding a custom method called getJWT to the user schema
userSchema.methods.getJWT = async function () {

    // 'this' refers to the current user document
    const user = this;

    // Creating a JWT token containing the user's ID
    // "DEV@Tinder$790" is the secret key used to sign the token
    // Token will expire in 7 days
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
        expiresIn: "10d",
    });

    // Returning the created token
    return token;
};

// Adding a custom method to the userSchema called "validatePassword"
// This method will check if the entered password is correct
userSchema.methods.validatePassword = async function(passwordInputByUser) {

    // "this" refers to the current user document from the database
    const user = this;
    const passwordHash = user.password;

    // bcrypt.compare() compares the plain password with the hashed password
    // It returns true if both match, otherwise false
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    // Returning whether the password is valid or not
    return isPasswordValid;
}; 


// Create a mongoose model so you can store and fetch data from your schema  
const User = mongoose.model("User", userSchema);
module.exports = User;