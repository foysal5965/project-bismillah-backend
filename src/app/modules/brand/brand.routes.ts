import express, { NextFunction, Request, Response } from 'express'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'
import { fileUploader } from '../../helpers/fileUploader'
import { brandController } from './brand.controller'
import { brandValidation } from './brand.validation'
const router = express.Router()
router.get('/', brandController.getAllFromDB)

router.post(
    "/create-brand",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        // console.log(req.body,'data')
        req.body = brandValidation.brandCreateValidation.parse(JSON.parse(req.body.data))
        return brandController.createBrand(req, res, next)
    }
);
router.get('/:id', brandController.getByIdFromDB)
router.patch(
    "/update/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = brandValidation.updateBrandValidation.parse(JSON.parse(req.body.data))
        return brandController.updateIntoDB(req, res, next)
    }
);
router.delete('/:id', brandController.deleteFromDB)
export const brandRouter = router