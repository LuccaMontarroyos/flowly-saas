import { Router } from "express";
import { UserController } from "./user.controller";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";
import { ensureAdmin } from "../../shared/middlewares/ensureAdmin";

const userRoutes = Router();
const userController = new UserController();

userRoutes.post("/", userController.register);

userRoutes.get("/", ensureAuthenticated, userController.index);
userRoutes.get("/me", ensureAuthenticated, userController.profile);
userRoutes.patch("/me", ensureAuthenticated, userController.updateProfile);

userRoutes.post("/member", ensureAuthenticated, ensureAdmin, userController.createMember);
userRoutes.patch("/:id/role", ensureAuthenticated, ensureAdmin, userController.updateRole);
userRoutes.patch("/avatar", ensureAuthenticated, userController.updateAvatar);
userRoutes.delete("/:id", ensureAuthenticated, ensureAdmin, userController.remove);

export { userRoutes };