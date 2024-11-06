import express from 'express'
import { customerAddressController } from './customerAddress.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
const router = express.Router();
router.post('/billing-address',
    auth(UserRole.CUSTOMER),
     customerAddressController.insertCustomerBillingAddress)
     export const customerAddressRouter = router 