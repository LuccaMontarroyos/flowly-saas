import { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service";

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId, id: userId } = req.user;

      const stats = await this.dashboardService.getDashboardStats(companyId, userId);

      return res.json(stats);
    } catch (error) {
      next(error);
    }
  };
}