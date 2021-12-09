const nodemailer = require('nodemailer');
require('dotenv').config();
exports.transporter =()=>{ nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS:true,
    auth: {
      user: process.env.email, // generated ethereal user
      pass: process.env.password, // generated ethereal password
    },
  });}
  