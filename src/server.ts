import { Server } from 'http';
import app from './app';
import express, { NextFunction, Request, Response } from 'express'
import config from './app/config';
import auth from './app/middlewares/auth';
import { UserRole } from '@prisma/client';
import { cartController } from './app/modules/cart/cart.controller';
const router = express.Router();

// Define routes separately
// router.post(
//     "/",
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
//     (req: Request, res: Response, next: NextFunction) => {
//         cartController.createCartForUser(req, res, next);
//     }
// );

// // Attach router to the app
// app.use(router);
async function main(){
   
    const server  : Server= app.listen(config.port,()=>{
        console.log('server runnig on port ', config.port)
    })
}
main()