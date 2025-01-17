// //done

// import { Resend } from 'resend';

// export const resend = new Resend(process.env.RESEND_API_KEY);

import sgMail from '@sendgrid/mail';

// Set the API key for SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  throw new Error('SENDGRID_API_KEY is not defined');
}

export const sendgrid = sgMail;
