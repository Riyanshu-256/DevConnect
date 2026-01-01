const validator = require("validator");

// VALIDATION OF SIGNUP DATA
const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    }
    if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password!");
    }

    return true;
};

// VALIDATE EDIT PROFILE DATA
const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName", "lastName", "emailId", "photoUrl",
        "gender", "age", "about", "skills"
    ];

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );

    return isEditAllowed;
};

module.exports = {
    validateSignUpData,
    validateEditProfileData,
};
