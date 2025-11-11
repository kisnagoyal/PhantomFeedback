// Import the SendGrid mail package
import sgMail from '@sendgrid/mail';

// Check if the SendGrid API key exists in environment variables
if (process.env.SENDGRID_API_KEY) {
  // Initialize SendGrid with your API key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  // Throw an error if the API key is missing
  throw new Error('SENDGRID_API_KEY is not defined');
}

// Export the configured SendGrid instance for use in other files
export const sendgrid = sgMail;
