import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { productController } from './product.controller';
import { productVallidation } from './product.validation';
import { fileUploader, multifileUploader } from '../../helpers/fileUploader';
const router = express.Router()

router.get('/', productController.getAllFromDB)
router.get('/:id', productController.getByIdFromDB)
router.post(
    "/create-product",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        
        req.body = productVallidation.createProductSchema.parse(JSON.parse(req.body.data))
        return productController.createProduct(req, res, next)
    }
);


export const productRouter = router