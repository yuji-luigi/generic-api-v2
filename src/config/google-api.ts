import vars from './vars';

const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const CLIENT_ID = vars.googleAuthClientId;
const CLIENT_SECRET = vars.googleAuthSecret;
const REDIRECT_URI = vars.redirectUrl;
// const REFRESH_TOKEN = 'YOUR_REFRESH_TOKEN';
const scopes = ['https://www.googleapis.com/auth/gmail.send'];

export async function authClientRun() {
  try {
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: vars.gmailAddress,
    //     pass: vars.gmailAppPassword
    //   }
    // });
    // const mailOptions = {
    //   from: 'hello@example.com',
    //   to: 'u.ji.jp777@gmail.com',
    //   subject: 'Subject',
    //   text: 'Email content'
    // };
    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //     // do something useful
    //   }
    // });
  } catch (error) {
    console.log(error);
  }
}
