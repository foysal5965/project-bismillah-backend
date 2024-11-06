import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { productController } from './product.controller';
import { productVallidation } from './product.validation';
import { multifileUploader } from '../../helpers/fileUploader';
const router = express.Router()

router.get('/', productController.getAllFromDB)

router.post(
    "/create-product",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    multifileUploader.upload,
    (req: Request, res: Response, next: NextFunction) => {
        // console.log(req.body,'data')
        req.body = productVallidation.createProductSchema.parse(JSON.parse(req.body.data))
        return productController.createProduct(req, res, next)
    }
);


export const productRouter = router