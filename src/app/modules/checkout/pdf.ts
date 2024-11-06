import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateInvoicePDF = (payload: any): Promise<string> => {
    const { orderData, products, customerData } = payload;

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `invoice_${orderData.id}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Add Logo
    // doc.image('path/to/logo.png', 50, 30, { width: 100 }).moveDown(2);

     // Company Name on the Left
     doc.fontSize(16).text('Nest', 50, 50);

     // Headers and Values (Horizontally Aligned)
     const headerY = 50; // Y-position for headers
     const valueY = headerY + 12; // Y-position for values
 
     doc.fontSize(14);
     doc.text('Ordered Date', 350, headerY, { align: 'left' });
     doc.text('Order Status', 450, headerY, { align: 'left' });
     doc.text('Invoice #', 550, headerY, { align: 'left' });
 
     // Values for each header
     doc.text(orderData.date, 350, valueY, { align: 'left' });
     doc.text(orderData.status, 450, valueY, { align: 'left' });
     doc.text(orderData.id, 550, valueY, { align: 'left' });
 
    // Company Information with Styling
    // doc.fillColor('#333333').fontSize(20).text('Nest', { align: 'center' });
    // doc.fillColor('#888888').fontSize(12).text('info.infinitytechintltd@gmail.com', { align: 'center' });
    // doc.text('+8801608-750791', { align: 'center' });
    // doc.text('7th Floor, Shamsuddin Mansion, 41 Gulshan North...', { align: 'center' });
    // doc.text('https://demo-grocery.infinitytechltd.com/', { align: 'center' });
    // doc.moveDown();
    // doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Line divider

    // // Payment Details Section
    // doc.fillColor('#000000').fontSize(14).text('Payment Details', { underline: true }).moveDown(0.5);
    // doc.fontSize(12).text(`Payment Method: ${orderData.paymentMethod}`);
    // doc.text(`Payment Amount: TK ${orderData.totalAmount}`);
    // doc.text(`Payment Status: ${orderData.paymentStatus}`);
    // doc.moveDown();

    // // Billing Information
    // doc.fillColor('#000000').fontSize(14).text('Billing Information', { underline: true }).moveDown(0.5);
    // doc.fontSize(12).text(`Name: ${customerData.name}`);
    // doc.text(`Email: ${customerData.email}`);
    // doc.text(`Phone: ${customerData.contactNumber}`);
    // doc.text(`Address: ${orderData.billingAddress.city}`);
    // doc.text(`District: ${orderData.billingAddress.state}`);
    // doc.text(`Area: ${orderData.billingAddress.streetAddress}`);
    // doc.text(`Postal Code: ${orderData.billingAddress.postalCode}`);
    // doc.moveDown();

    // // Shipping Information
    // doc.fillColor('#000000').fontSize(14).text('Shipping Information', { underline: true }).moveDown(0.5);
    // doc.fontSize(12).text('Shipping details same as billing details.');
    // doc.moveDown();

    // // Table Header with Column Titles
    // doc.fillColor('#444444').font('Helvetica-Bold').fontSize(12);
    // doc.text('#', 50, doc.y, { continued: true });
    // doc.text('Product Name', 100, doc.y, { continued: true });
    // doc.text('Price', 250, doc.y, { continued: true });
    // doc.text('Discount', 300, doc.y, { continued: true });
    // doc.text('Qty', 350, doc.y, { continued: true });
    // doc.text('Total Discount', 400, doc.y, { continued: true });
    // doc.text('Subtotal', 470, doc.y);
    // doc.moveDown();

    // // Product Table Rows with Alternating Background Colors
    // // Product Table Rows with Alternating Colors
    // products.forEach((item:any, index:any) => {
    //     if (doc.y > 700) doc.addPage(); // Add new page if nearing bottom

    //     doc.fillColor(index % 2 === 0 ? '#f0f0f0' : '#ffffff');
    //     doc.text(`${index + 1}.`, 50, doc.y, { continued: true });
    //     doc.text(`${item.product.productName}`, 100, doc.y, { continued: true });
    //     doc.text(`TK ${item.product.regularSalePrize}`, 250, doc.y, { continued: true });
    //     doc.text(`TK ${item.product.discount}`, 300, doc.y, { continued: true });
    //     doc.text(`${item.quantity}`, 350, doc.y, { continued: true });
    //     // doc.text(`TK ${item.discountTotal}`, 400, doc.y, { continued: true });
    //     doc.text(`TK ${item.subTotal}`, 470, doc.y);
    //     doc.moveDown();
    // });

    // // Summary Section Position Adjustment
    // if (doc.y > 700) doc.addPage(); // Add page before summary if needed

    // doc.moveDown(1).fillColor('#000000');
    // doc.fontSize(12).text(`Net total: TK ${orderData.netTotal}`);
    // doc.text(`Shipping Charge (+): TK ${orderData.shippingCharge}`);
    // doc.fontSize(14).font('Helvetica-Bold').text(`Total: TK ${orderData.totalAmount}`);


    // // Summary Section
    // doc.moveDown(1).fillColor('#000000');
    // doc.fontSize(12).text(`Net total: TK 1`);
    // doc.text(`Shipping Charge (+): TK 60`);
    // doc.fontSize(14).font('Helvetica-Bold').text(`Total: TK ${orderData.totalAmount}`);
    // doc.moveDown();

    // // Notes Section
    // doc.fontSize(10).text('Notes');
    // doc.text('Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.');

    // Finalize the document
    doc.end();

    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
};
