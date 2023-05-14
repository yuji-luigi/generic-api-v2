import vars from './vars';

import nodemailer from 'nodemailer';

// const REFRESH_TOKEN = 'YOUR_REFRESH_TOKEN';

export async function authClientRun() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: vars.gmailAddress,
        pass: vars.gmailAppPassword
      }
    });
    const mailOptions = {
      from: 'hello@example.com',
      to: 'u.ji.jp777@gmail.com',
      subject: 'Subject',
      text: 'Email content'
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        // do something useful
      }
    });
  } catch (error) {
    console.log(error);
  }
}
