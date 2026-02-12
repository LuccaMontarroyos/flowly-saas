import { Request, Response, NextFunction } from "express";
import { CompanyService } from "./company.service";

export class CompanyController {
  private companyService = new CompanyService();

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId } = req.user;
      const company = await this.companyService.getCompany(companyId);
      return res.json(company);
    } catch (error) {
      next(error);
    }
  };
}