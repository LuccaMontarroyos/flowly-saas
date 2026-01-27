import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { AppError } from './shared/errors/AppError';

import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/users/user.routes';
import { projectRoutes } from './modules/project/project.routes'
import { taskRoutes } from './modules/task/task.routes';

export class App {
    public app: Express;

    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
        this.exceptionHandler();
    }

    private middlewares() {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(helmet());
    }

    private routes() {
        this.app.get('/health', (req, res) => {
            res.json({ status: 'ok', timestamp: new Date() });
        });

        this.app.use('/api/v1/auth', authRoutes);
        this.app.use('/api/v1/users', userRoutes);
        this.app.use('/api/v1/projects', projectRoutes);
        this.app.use('/api/v1/tasks', taskRoutes);
    }

    private exceptionHandler() {
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof AppError) {
                return res.status(err.statusCode).json({
                    status: 'error',
                    message: err.message,
                });
            }

            if (err.name === 'ZodError') {
                return res.status(400).json({
                  status: 'error',
                  message: 'Validation error',
                  // @ts-ignore
                  issues: err.errors
                });
             }
             
            console.error(err);

            return res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            });
        });
    }

    public listen(port: number) {
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
}