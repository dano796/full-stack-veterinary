const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const { validateUser, validateUserUpdate } = require("../schemas/users");
require("dotenv").config();

class UserController {
  static async createUser(req, res) {
    try {
      const validationResult = validateUser(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ errors: validationResult.errors });
      }

      const { name, email, password, phoneNumber, address } =
        validationResult.data;

      const newUser = await UserModel.createUser(
        name,
        email,
        password,
        phoneNumber,
        address
      );
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findByEmail(email);

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await UserModel.comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userId: user.user_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1 * 60 * 60 * 1000,
      });

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async logoutUser(req, res) {
    try {
      res.clearCookie("access_token");
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      const token = req.cookies.access_token;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        user_id: user.user_id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);

      if (!req.session.user) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUserById(req, res) {
    try {
      const { id } = req.params;

      const validationResult = validateUserUpdate(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ errors: validationResult.errors });
      }

      const { name, email, password, phoneNumber, address } =
        validationResult.data;

      const updatedUser = await UserModel.updateById(
        id,
        name,
        email,
        password,
        phoneNumber,
        address
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteUserById(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await UserModel.deleteById(id);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;
