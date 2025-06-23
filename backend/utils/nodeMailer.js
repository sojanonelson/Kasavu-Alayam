// utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

const baseEmailTemplate = (content, options = {}) => {
  const logoUrl = 'https://i.ibb.co/Y7HK7bf/kasavu-logo.png'; // Textile shop logo
  const primaryColor = options.primaryColor || '#047857'; // Emerald green for textile brand
  const secondaryColor = options.secondaryColor || '#065f46';

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options.subject || 'Kasavu Aalayam Email'}</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f3f4f6;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
      }
      .header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 1px solid #e5e7eb;
      }
      .logo {
        max-height: 60px;
      }
      .content {
        padding: 30px 20px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #6b7280;
        border-top: 1px solid #e5e7eb;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: ${primaryColor};
        color: white !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 500;
        margin: 15px 0;
      }
      h1 {
        color: ${primaryColor};
        font-size: 22px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="${logoUrl}" alt="Kasavu Aalayam Logo" class="logo"> 
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Kasavu Aalayam. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

const sendMail = async ({ to, subject, text, html, logoUrl }) => {
  try {
    const info = await transporter.sendMail({
      from: `Kasavu Aalayam <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: baseEmailTemplate(html, { subject, logoUrl }),
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// 1. OTP for login/verification
const sendOtpEmail = (to, otp) => {
  const content = `
    <h1>Your OTP Code</h1>
    <p>Use the following OTP to verify your account or complete creation:</p>
    <h2>${otp}</h2>
    <p>This OTP is valid for only a few minutes. Do not share it with anyone.</p>
  `;
  return sendMail({
    to,
    subject: 'Kasavu Aalayam OTP Verification',
    text: `Your OTP is ${otp}`,
    html: content
  });
};

// 2. Order confirmation email
const sendOrderConfirmationEmail = (to, name, orderId, items, total) => {
  const itemList = items.map(i => `<li>${i.name} × ${i.qty} - ₹${i.price}</li>`).join('');
  const content = `
    <h1>🧵 Order Confirmed</h1>
    <p>Hi ${name},</p>
    <p>Thanks for your order <strong>#${orderId}</strong>. Here are your order details:</p>
    <ul>${itemList}</ul>
    <p><strong>Total:</strong> ₹${total}</p>
    <p>We will notify you once your items are shipped.</p>
  `;
  return sendMail({
    to,
    subject: `Order Confirmation - #${orderId}`,
    text: `Order #${orderId} confirmed. Total: ₹${total}`,
    html: content
  });
};

// 3. Profile phone number updated
const sendPhoneUpdateAlert = (to, name, phone) => {
  const content = `
    <h1>📱 Phone Number Updated</h1>
    <p>Hi ${name},</p>
    <p>Your phone number has been successfully updated to <strong>${phone}</strong>.</p>
  `;
  return sendMail({
    to,
    subject: 'Phone Number Updated',
    text: `Your phone number has been updated to ${phone}`,
    html: content
  });
};

// 4. Password reset OTP
const sendPasswordResetOtp = (to, otp) => {
  const content = `
    <h1>🔐 Password Reset OTP</h1>
    <p>We received a request to reset your password. Use the OTP below:</p>
    <h2>${otp}</h2>
    <p>If you didn’t request this, ignore this email.</p>
  `;
  return sendMail({
    to,
    subject: 'Password Reset OTP - Kasavu Aalayam',
    text: `Use this OTP to reset your password: ${otp}`,
    html: content
  });
};

module.exports = {
  sendMail,
  sendOtpEmail,
  sendOrderConfirmationEmail,
  sendPhoneUpdateAlert,
  sendPasswordResetOtp,
  baseEmailTemplate
};
