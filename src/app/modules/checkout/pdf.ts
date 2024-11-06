import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateInvoicePDF = (payload: any): Promise<string> => {
    const {orderData, products, customerData} = payload
    console.log(products,'customer')
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `invoice_${orderData.id}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Company Information
    doc.fontSize(16).text('Nest', { align: 'center' });
    doc.fontSize(10).text('info.infinitytechintltd@gmail.com', { align: 'center' });
    doc.text('+8801608-750791', { align: 'center' });
    doc.text('7th Floor, Shamsuddin Mansion, 41 Gulshan North, Road no. 53, Gulshan-2, Dhaka-1212', { align: 'center' });
    doc.text('https://demo-grocery.infinitytechltd.com/', { align: 'center' });
    doc.moveDown();

    // Payment Details
    doc.fontSize(12).text('Payment Details', { underline: true });
    doc.text(`Payment Method: ${orderData.paymentMethod}`);
    doc.text(`Payment Amount: TK ${orderData.totalAmount}`);
    doc.text(`Payment Status: ${orderData.paymentStatus}`);
    doc.moveDown();

    // Billing Information
    doc.fontSize(12).text('Billing Information', { underline: true });
    doc.text(`Name: ${customerData.name}`);
    doc.text(`Email: ${customerData.email}`);
    doc.text(`Phone: ${customerData.contactNumber}`);
    doc.text(`Address: ${orderData.billingAddress.city}`);
    doc.text(`District: ${orderData.billingAddress.state}`);
    doc.text(`Area: ${orderData.billingAddress.streetAddress}`);
    doc.text(`Postal Code: ${orderData.billingAddress.postalCode}`);
    doc.moveDown();

    // Shipping Information
    doc.fontSize(12).text('Shipping Information', { underline: true });
    doc.text('Shipping details same as billing details.');
    doc.moveDown();

    // Table Header
    doc.text('#', 50, doc.y, { continued: true });
    doc.text('Product Name', 100, doc.y, { continued: true });
    doc.text('Price', 250, doc.y, { continued: true });
    doc.text('Discount', 300, doc.y, { continued: true });
    doc.text('Qty', 350, doc.y, { continued: true });
    doc.text('Total Discount', 400, doc.y, { continued: true });
    doc.text('Subtotal', 470, doc.y);
    doc.moveDown();

    // Products
    products.forEach((item: any, index: number) => {
        doc.text(`${index + 1}.`, 50, doc.y, { continued: true });
        doc.text(`${item.product.productName}`, 100, doc.y, { continued: true });
        doc.text(`TK ${item.product.regularSalePrize}`, 250, doc.y, { continued: true });
        doc.text(`TK ${item.product.discount}`, 300, doc.y, { continued: true });
        doc.text(`${item.quantity}`, 350, doc.y, { continued: true });
        // doc.text(`TK ${item.discountTotal}`, 400, doc.y, { continued: true });
        doc.text(`TK ${item.subTotal}`, 470, doc.y);
    });
    doc.moveDown();

    // Summary
    doc.text(`Net total: TK 1`);
    doc.text(`Shipping Charge (+): TK 60`);
    doc.fontSize(14).font('Helvetica-Bold').text(`Total: TK ${orderData.totalAmount}`);
    doc.moveDown();

    // Notes
    doc.fontSize(10).text('Notes');
    doc.text('Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.');
    
    // Finalize the document
    doc.end();

    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
};
