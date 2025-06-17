// testEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: `"Budgetly Test" <${process.env.EMAIL_USER}>`,
  to: 'your_other_email@example.com', // 👈 Replace with any email you control
  subject: 'Test Email from Budgetly',
  text: '🎉 If you’re reading this, your Gmail SMTP works!',
}, (err, info) => {
  if (err) {
    console.error('❌ Send failed:', err);
  } else {
    console.log('✅ Send success:', info.response);
  }
});
