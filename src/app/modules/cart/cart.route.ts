import express from 'express'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'
import { cartController } from './cart.controller'
const router = express.Router()
router.post(
    '/add-to-cart',
    auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
    cartController.addItemToCart
)
router.delete(
    '/',
    auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
    cartController.removeItemFromCart
 )
 export const cartRouter = router