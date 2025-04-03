const express = require("express");
const UserController = require("../controllers/user");
const authenticateToken = require("../middlewares/auth");

const usersRouter = express.Router();

usersRouter.post("/register", UserController.createUser);
usersRouter.post("/login", UserController.loginUser);

usersRouter.get("/me", authenticateToken, UserController.getCurrentUser);
usersRouter.post("/logout", authenticateToken, UserController.logoutUser);
usersRouter.get("/:id", authenticateToken, UserController.getUserById);
usersRouter.put("/:id", authenticateToken, UserController.updateUserById);
usersRouter.delete("/:id", authenticateToken, UserController.deleteUserById);

module.exports = usersRouter;
