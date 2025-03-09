import nodemailer from 'nodemailer';

let testAccount: any = null;

const createTransporter = async () => {
  if (!testAccount) {
    // Generate test SMTP service account from ethereal.email
    testAccount = await nodemailer.createTestAccount();
  }

  // Create reusable transporter object using the default SMTP transport
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
};

export const sendOrderConfirmationEmail = async (order: any) => {
  try {
    const transporter = await createTransporter();

    // Send buyer email
    const buyerInfo = await transporter.sendMail({
      from: '"Ebuy Support" <support@ebuy.com>',
      to: order.buyer.email,
      subject: `Order Confirmation #${order.id}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Order #${order.id}</p>
        <p>Total: $${order.totalAmount}</p>
        <h2>Items:</h2>
        <ul>
          ${order.items.map((item: any) => `
            <li>${item.quantity}x ${item.product.title} - $${item.price}</li>
          `).join('')}
        </ul>
      `
    });

    // Send seller email
    const sellerInfo = await transporter.sendMail({
      from: '"Ebuy Support" <support@ebuy.com>',
      to: order.seller.email,
      subject: `New Order #${order.id}`,
      html: `
        <h1>You have a new order!</h1>
        <p>Order #${order.id}</p>
        <p>Total: $${order.totalAmount}</p>
        <h2>Items:</h2>
        <ul>
          ${order.items.map((item: any) => `
            <li>${item.quantity}x ${item.product.title} - $${item.price}</li>
          `).join('')}
        </ul>
      `
    });

    // Log test URLs
    console.log('Buyer Preview URL: %s', nodemailer.getTestMessageUrl(buyerInfo));
    console.log('Seller Preview URL: %s', nodemailer.getTestMessageUrl(sellerInfo));

  } catch (error) {
    console.error('Error sending emails:', error);
    // Don't throw error, just log it
  }
};