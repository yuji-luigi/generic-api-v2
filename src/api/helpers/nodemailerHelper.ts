import vars from '../../config/vars';

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
    const result = await transporter.sendMail(
      mailOptions /* , function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        // do something useful
      }
    } */
    );
    console.log('Email sent: ' + result.response);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function _() {
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
    const result = await transporter.sendMail(
      mailOptions /* , function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        // do something useful
      }
    } */
    );
    console.log('Email sent: ' + result.response);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
