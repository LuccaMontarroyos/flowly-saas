import { Router } from "express";
import { UserController } from "./user.controller";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";
import { ensureAdmin } from "../../shared/middlewares/ensureAdmin";

const userRoutes = Router();
const userController = new UserController();


userRoutes.get("/", ensureAuthenticated, userController.index);
userRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  userController.store
);
userRoutes.patch("/:id/role", ensureAuthenticated, ensureAdmin, userController.updateRole);
userRoutes.delete("/:id", ensureAuthenticated, ensureAdmin, userController.remove);

export { userRoutes };