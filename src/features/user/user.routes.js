// Manage Routes/Path to UserController

import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

// Initialize Express Router
const userRouter = express.Router();

// Create instance of User controller
const userController = new UserController();

// Routes
userRouter.post("/signup", (req, res, next) => {
  userController.signUp(req, res, next);
});

userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res);
});

userRouter.put("/reset-password", jwtAuth, (req, res) => {
  userController.resetPassword(req, res);
});

export default userRouter;
