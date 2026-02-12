import { Router } from "express";
import { CompanyController } from "./company.controller";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";

const companyRoutes = Router();
const companyController = new CompanyController();

companyRoutes.get("/me", ensureAuthenticated, companyController.show);

export { companyRoutes };