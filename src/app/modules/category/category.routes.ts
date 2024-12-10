import express, { NextFunction, Request, Response } from 'express'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'
import { fileUploader } from '../../helpers/fileUploader'
import { productCategoryController } from './category.controller'
import { productCategoryValidation } from './category.validation'
const router = express.Router()
router.get('/', productCategoryController.getAllFromDB)

router.post(
    "/create-category",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        
        req.body = productCategoryValidation.createCategoryValidation.parse(JSON.parse(req.body.data))
        return productCategoryController.createCategory(req, res, next)
    }
);
router.get('/:id', productCategoryController.getByIdFromDB)
router.patch(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = productCategoryValidation.updateCategoryValidation.parse(JSON.parse(req.body.data))
        return productCategoryController.updateIntoDB(req, res, next)
    }
);
router.delete('/:id', productCategoryController.deleteFromDB)
export const productCategoryRouter = router