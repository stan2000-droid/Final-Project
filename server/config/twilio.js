import twilio from 'twilio';
import dotenv from 'dotenv';

// Make sure environment variables are loaded
dotenv.config();

export const twilioConfig = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER
};

// Debug environment variables
console.log('Twilio Config:', {
    accountSid: process.env.TWILIO_ACCOUNT_SID ? 'Set' : 'Not Set',
    authToken: process.env.TWILIO_AUTH_TOKEN ? 'Set' : 'Not Set',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER
});

// Create a function to get the Twilio client only when needed
// This prevents initialization errors when credentials aren't available
export const getTwilioClient = () => {
    if (!twilioConfig.accountSid || !twilioConfig.authToken) {
        console.warn('Twilio credentials are not configured properly');
        return null;
    }
    return twilio(twilioConfig.accountSid, twilioConfig.authToken);
};

// For backward compatibility
export const twilioClient = getTwilioClient();
