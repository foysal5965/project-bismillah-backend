import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { checkoutService } from "./checkout.service";
import { IAuthUser } from "../../interfaces/commont";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import prisma from "../../shared/prisma";
import jsPDF from 'jspdf';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
    const result = await checkoutService.insertIntoDb(req.body, req.user as IAuthUser)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "checkout successfuly!",
        data: result
    })
})


const createInvoice = catchAsync(async (req: Request, res: Response)=>{
    const { orderId } = req.params;


    // Fetch order data from the database
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
    });

    const pdfData = { orderData, products, customerData };

    try {
        // Generate PDF using jsPDF
        const doc = new jsPDF();
        
        // Set document title
        doc.setFontSize(20);
        doc.text('Invoice', 105, 20, { align: 'center' });

        // Add customer information
        doc.setFontSize(12);
        doc.text(`Customer: ${customerData?.name}`, 20, 40);
        doc.text(`Email: ${customerData?.email}`, 20, 50);
        doc.text(`Address: ${orderData.billingAddress.streetAddress}, ${orderData.billingAddress.city}, ${orderData.billingAddress.country}`, 20, 60);

        // Add order details
        doc.text(`Order ID: ${orderData.id}`, 20, 80);
        doc.text(`Order Date: ${new Date(orderData.createdAt).toLocaleDateString()}`, 20, 90);

        // Add table for ordered products
        const startY = 110;
        doc.text('Products', 20, startY);

        const tableStartY = startY + 10;
        doc.text('Product Name', 20, tableStartY);
        doc.text('Quantity', 120, tableStartY);
        doc.text('Price', 160, tableStartY);

        let rowY = tableStartY + 10;
       
        products.forEach((item) => {
             //@ts-ignore
            doc.text(item?.product?.productName, 20, rowY);
            doc.text(`${item.quantity}`, 120, rowY);
             //@ts-ignore
            doc.text(`$${(item.product.regularSalePrize * item.quantity).toFixed(2)}`, 160, rowY);
            rowY += 10;
        });

        // Add total
         //@ts-ignore
        const total = products.reduce((sum, item) => sum + (item.product.regularSalePrize * item.quantity), 0);
        doc.text(`Total: $${total.toFixed(2)}`, 120, rowY);

        // Generate the PDF and send it for download
        const pdfBuffer = doc.output('arraybuffer');

        // Send the PDF file for download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice_${orderId}.pdf`);
        res.send(Buffer.from(pdfBuffer));

    } catch (error) {
        res.status(500).send('Error generating invoice PDF');
    }
})

export const checkoutController = {
    insertIntoDb,
    createInvoice
}