import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHendler';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser'
import { cartController } from './app/modules/cart/cart.controller';
import auth from './app/middlewares/auth';
import { UserRole } from '@prisma/client';
const app: Application = express()
app.use(cors())
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'health  care runnig' })
})
app.post(
    "/api/v1",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
    (req: Request, res: Response, next: NextFunction) => {
        cartController.createCartForUser(req, res, next);
    }
);
app.use(globalErrorHandler);
cartController.createCartForUser
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!"
        }
    })
})
export default app
