import express, { NextFunction, Request, Response } from 'express'
import { userController } from './user.controller'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'
import { fileUploader } from '../../helpers/fileUploader'
import { userValidation } from './user.validation'
const router = express.Router()
router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    userController.getAllFromDB
);

router.get(
    '/me',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
    userController.getMyProfile
)

router.post(
    "/create-admin",
    // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
        return userController.createAdmin(req, res, next)
    }
);
router.post(
    "/create-admin",
    // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
        return userController.createAdmin(req, res, next)
    }
);
router.post(
    "/create-customer",
    // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createCustomer.parse(JSON.parse(req.body.data))
        return userController.createCustomer(req, res, next)
    }
);
router.post(
    "/create-vendor",
    // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createVendors.parse(JSON.parse(req.body.data))
        return userController.createVendors(req, res, next)
    }
);
router.patch(
    "/update-my-profile",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return userController.updateMyProfie(req, res, next)
    }
);
export const userRouter = router