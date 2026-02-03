import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.get("/", ensureAuthenticated, dashboardController.getStats);

export { dashboardRoutes };