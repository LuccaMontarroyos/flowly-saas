import { Router } from "express";
import { ensureAdmin } from "../../shared/middlewares/ensureAdmin";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";
import { InviteController } from "./invite.controller";

const inviteRoutes = Router();
const inviteController = new InviteController();

inviteRoutes.post("/", ensureAuthenticated, ensureAdmin, inviteController.create);
inviteRoutes.get("/:token", inviteController.validate);
export { inviteRoutes };