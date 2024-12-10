import express from 'express'
import { checkoutController } from './checkout.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
const router = express.Router();
router.post('/',
    auth(UserRole.CUSTOMER),
    checkoutController.insertIntoDb)

    
    router.get('/download-invoice/:orderId',checkoutController.createInvoice );
    
export const checkoutRouter = router