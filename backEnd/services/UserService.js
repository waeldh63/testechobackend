const Model = require("../models"); // Adjust the path according to your file structure
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Function to get all users
const getAllUsers = async () => {
  try {
    const users = await Model.User.findAll(); // Use your ORM or database query here
    return users;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching users: " + error.message);
  }
};
const createUser = async (Name, password, email) => {
  try {
    const existingUser = await Model.User.findOne({
      where: { email },
    });

    if (existingUser) {
      console.log("Email already exists:", email);
      // Handle the case where the email already exists
      return { error: "Email already in use" };
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Model.User.create({
      Name,
      password: hashedPassword,
      email,
    });
    console.log("Client added successfully:", newUser.toJSON());

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching users: " + error.message);
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await Model.User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      //   if (user && (await bcrypt.compare(password, user.password)))

      const token = jwt.sign(
        {
          UserId: user.dataValues.id,
          email: user.dataValues.email,
          name: user.dataValues.Name,
        },
        "e5383b8d051c50c5c0e45b79cc42308165f8c82ff2f9e33fc91403dd353d3de6",
        { expiresIn: "1h" }
      );
      console.log(token);
      return token;
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error login:", error.message);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  loginUser,
  createUser,
};
