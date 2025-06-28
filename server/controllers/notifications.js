import { getTwilioClient, twilioConfig } from '../config/twilio.js';
import User from '../models/User.js';

export const sendSMS = async (req, res) => {
    const { phoneNumber, message } = req.body;
    try {
        // Check if Twilio is properly configured
        if (!twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.phoneNumber) {
            return res.status(400).json({ 
                success: false, 
                error: 'Twilio is not properly configured' 
            });
        }
        
        // Get the Twilio client
        const client = getTwilioClient();
        if (!client) {
            return res.status(400).json({ 
                success: false, 
                error: 'Failed to initialize Twilio client' 
            });
        }

        const result = await client.messages.create({
            body: message,
            from: twilioConfig.phoneNumber,
            to: phoneNumber
        });
        res.status(200).json({ success: true, messageId: result.sid });
    } catch (error) {
        console.error('SMS sending failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const sendWhatsApp = async (req, res) => {
    const { phoneNumber, message } = req.body;
    try {
        // Check if Twilio WhatsApp is properly configured
        if (!twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.whatsappNumber) {
            return res.status(400).json({ 
                success: false, 
                error: 'Twilio WhatsApp is not properly configured' 
            });
        }
        
        // Get the Twilio client
        const client = getTwilioClient();
        if (!client) {
            return res.status(400).json({ 
                success: false, 
                error: 'Failed to initialize Twilio client' 
            });
        }

        const result = await client.messages.create({
            body: message,
            from: `whatsapp:${twilioConfig.whatsappNumber}`,
            to: `whatsapp:${phoneNumber}`
        });
        res.status(200).json({ success: true, messageId: result.sid });
    } catch (error) {
        console.error('WhatsApp sending failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getNotifiedUsers = async (req, res) => {
    try {
        // Find all subscribed users who have at least one notification type enabled
        const notifiedUsers = await User.find({
            isSubscribed: true,
            $or: [
                { 'notifications.smsAlerts': true },
                { 'notifications.whatsappAlerts': true },
                { 'notifications.popNotifications': true }
            ]
        });
        
        res.status(200).json(notifiedUsers);
    } catch (error) {
        console.error('Error fetching notified users:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getTwilioConfig = async (req, res) => {
    try {
        // Check if Twilio is properly configured by testing if the required environment variables are set
        const isConfigured = Boolean(
            twilioConfig.accountSid && 
            twilioConfig.authToken && 
            twilioConfig.phoneNumber
        );
        
        // Return only the non-sensitive parts of the Twilio configuration
        res.status(200).json({
            isConfigured,
            phoneNumber: twilioConfig.phoneNumber ? 
                `${twilioConfig.phoneNumber.substring(0, 3)}...${twilioConfig.phoneNumber.substring(twilioConfig.phoneNumber.length - 4)}` : 
                null,
            whatsappConfigured: Boolean(twilioConfig.whatsappNumber),
            // Do not include account SID or auth token as they are sensitive
        });
    } catch (error) {
        console.error('Error getting Twilio configuration:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};