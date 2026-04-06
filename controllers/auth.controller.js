const bcrypt = require("bcrypt");
const User = require("../models/User");
const Cart = require("../models/Cart");
const { generateToken } = require("../utils/jwt");

exports.register = async (req, res) => {
  try {

    const { first_name, middle_name, last_name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      middle_name,
      last_name,
      email,
      phone,
      password: hashedPassword
    });

    // create cart automatically
    await Cart.create({ user_id: user.id });

    res.json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.json({
      message: "Login successful"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {

  res.clearCookie("token");

  res.json({
    message: "Logged out successfully"
  });

};

exports.updateUserStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ status });

    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user status" });
  }
};