const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }

  if (!emailId) {
    throw new Error("Email is required");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  if (age && age < 18) {
    throw new Error("Age must be at least 18");
  }

  if (gender && !["Male", "Female", "Other"].includes(gender)) {
    throw new Error("Invalid gender value");
  }

  return true;
};

const validateEditProfileData = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "age",
    "gender",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );

  if (!isEditAllowed) {
    throw new Error("Invalid fields in profile update");
  }

  if (req.body.age && req.body.age < 18) {
    throw new Error("Age must be at least 18");
  }

  if (
    req.body.gender &&
    !["Male", "Female", "Other"].includes(req.body.gender)
  ) {
    throw new Error("Invalid gender value");
  }

  return true;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
