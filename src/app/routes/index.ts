import express from 'express'
import { userRouter } from '../modules/user/user.routes'
import { AuthRoutes } from '../modules/auth/auth.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { productCategoryRouter } from '../modules/category/category.routes';
import { brandRouter } from '../modules/brand/brand.routes';
import { productRouter } from '../modules/product/product.route';
import { cartRouter } from '../modules/cart/cart.route';
import { customerAddressRouter } from '../modules/customerAddress/customerAddress.route';
import { checkoutRouter } from '../modules/checkout/checkout.route';
import { paymentRouter } from '../modules/payment/payment.routes';
const router = express.Router()
const moduleRoutes = [
    // ... routes
    {
        path: "/user",
        route: userRouter
    },
    {
        path: "/admin",
        route: AdminRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/category",
        route: productCategoryRouter
    },
    {
        path: "/brand",
        route: brandRouter
    },
    {
        path: "/product",
        route: productRouter
    },
    {
        path: "/cart",
        route: cartRouter
    },
    {
        path: "/address",
        route: customerAddressRouter
    },
    {
        path: "/checkout",
        route: checkoutRouter
    },
    {
        path: "/payment",
        route: paymentRouter
    },

]
moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;