import fs from 'fs';
import express from 'express'
import { checkoutController } from './checkout.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import prisma from '../../shared/prisma';
import { generateInvoicePDF } from './pdf';
const router = express.Router();
router.post('/',
    auth(UserRole.CUSTOMER),
    checkoutController.insertIntoDb)

router.get('/download-invoice/:orderId', async (req, res) => {
    const { orderId } = req.params;

    // Fetch order data from database
    const orderData = await prisma.checkout.findUnique({
        where: { id: orderId },
        include: {
            user: true,
            cart: {
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            },
            billingAddress: true
        }
    });
    if (!orderData) {
        return res.status(404).send('Order not found');
    }
    const products = await Promise.all(
        orderData.cart.items.map(async (item) => {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            });
            return {
                ...item,
                product,
            };
        })
    );
    const customerData = await prisma.customer.findFirst({
        where: {
            email: orderData?.user.email
        }
    })

    const pdfData = { orderData, products, customerData }
    try {
        // Generate the PDF
        const filePath = await generateInvoicePDF(pdfData);

        // Set headers for download
        res.download(filePath, `invoice_${orderId}.pdf`, (err) => {
            if (err) console.error('Error sending PDF:', err);
            fs.unlinkSync(filePath);  // Optional: Clean up temp file
        });
    } catch (error) {
        res.status(500).send('Error generating invoice PDF');
    }
});
export const checkoutRouter = router