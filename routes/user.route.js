import { Router } from "express";
import { deleteUser, getUserProfile, getUsers, login, register, resetPassword, updateUser } from "../controllers/user.controller.js";
import { isAdmin, verifyToken } from "../middleware/authHandler.js";

const userRouter = Router();

userRouter.post('/register', verifyToken, isAdmin, register);
userRouter.post('/login', login);
userRouter.get("/all", verifyToken, isAdmin, getUsers);
userRouter.get("/", verifyToken, getUserProfile);
userRouter.put("/:id", verifyToken, isAdmin, updateUser);
userRouter.put("/:id/reset-password", verifyToken, resetPassword);
userRouter.delete("/:id", verifyToken, isAdmin, deleteUser);

export default userRouter;