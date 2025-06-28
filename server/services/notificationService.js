// import { getTwilioClient, twilioConfig } from '../config/twilio.js';
// import User from '../models/User.js';

// // Cache to track when notifications were last sent to each user
// const notificationCache = {
//   // userId: { lastSentTimestamp: Date.now() }
// };

// /**
//  * Send SMS notification
//  * @param {string} to - Recipient phone number
//  * @param {string} message - Message content
//  * @returns {Promise} - Twilio message response
//  */
// export const sendSMS = async (to, message) => {  try {
//     // Check if Twilio is properly configured
//     if (!twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.phoneNumber) {
//       console.log('Twilio is not properly configured. SMS notification skipped.');
//       return { 
//         success: false, 
//         error: 'Twilio not configured',
//         skipped: true
//       };
//     }
    
//     // Get the Twilio client
//     const client = getTwilioClient();
//     if (!client) {
//       console.log('Failed to initialize Twilio client. SMS notification skipped.');
//       return { 
//         success: false, 
//         error: 'Twilio client initialization failed',
//         skipped: true
//       };
//     }
    
//     const result = await client.messages.create({
//       body: message,
//       from: twilioConfig.phoneNumber,
//       to: to
//     });
    
//     console.log(`SMS sent to ${to}: ${result.sid}`);
//     return result;  } catch (error) {
//     console.error(`Error sending SMS to ${to}:`, error);
    
//     // Handle specific Twilio error codes gracefully
//     if (error.code === 21606) {
//       return {
//         success: false,
//         error: 'International messaging not supported for this destination',
//         skipped: true,
//         details: error.message
//       };
//     }
    
//     throw error;
//   }
// };

// /**
//  * Send WhatsApp notification
//  * @param {string} to - Recipient phone number
//  * @param {string} message - Message content
//  * @returns {Promise} - Twilio message response
//  */
// export const sendWhatsApp = async (to, message) => {  try {
//     // Check if Twilio WhatsApp is properly configured
//     if (!twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.whatsappNumber) {
//       console.log('Twilio WhatsApp is not properly configured. WhatsApp notification skipped.');
//       return { 
//         success: false, 
//         error: 'Twilio WhatsApp not configured',
//         skipped: true
//       };
//     }
    
//     // Get the Twilio client
//     const client = getTwilioClient();
//     if (!client) {
//       console.log('Failed to initialize Twilio client. WhatsApp notification skipped.');
//       return { 
//         success: false, 
//         error: 'Twilio client initialization failed',
//         skipped: true
//       };
//     }
    
//     // Format the 'to' number for WhatsApp
//     const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    
//     const result = await client.messages.create({
//       body: message,
//       from: `whatsapp:${twilioConfig.whatsappNumber}`,
//       to: whatsappTo
//     });
    
//     console.log(`WhatsApp message sent to ${to}: ${result.sid}`);
//     return result;  } catch (error) {
//     console.error(`Error sending WhatsApp message to ${to}:`, error);
    
//     // Handle specific Twilio error codes gracefully
//     if (error.code === 21606) {
//       return {
//         success: false,
//         error: 'International messaging not supported for this destination',
//         skipped: true,
//         details: error.message
//       };
//     }
    
//     throw error;
//   }
// };

// /**
//  * Send a fallback email notification when SMS/WhatsApp is not available
//  * This is a placeholder - you would implement actual email sending here
//  * @param {string} to - User email address
//  * @param {string} message - Message content 
//  * @returns {Promise<Object>} - Status of the notification
//  */
// export const sendFallbackNotification = async (user, message) => {
//   try {
//     // This is where you would implement email notification
//     // For now, we'll just log it
//     console.log(`[FALLBACK NOTIFICATION] Would send email to ${user.email || 'user'}: ${message}`);
    
//     // Record this in your database or notification log
    
//     return {
//       success: true,
//       method: 'fallback',
//       message: 'Fallback notification logged'
//     };
//   } catch (error) {
//     console.error('Error sending fallback notification:', error);
//     return {
//       success: false,
//       method: 'fallback',
//       error: error.message
//     };
//   }
// };

// /**
//  * Send detection notification to a user based on their preferences
//  * @param {Object} user - User document
//  * @param {Object} detection - Detection data
//  * @returns {Promise<Object>} - Status of notifications sent
//  */
// export const sendDetectionNotification = async (user, detection) => {
//   const results = {
//     sms: false,
//     whatsapp: false,
//     fallback: false
//   };

//   // Check if we should respect the user's alert frequency
//   const userId = user._id.toString();
//   const now = Date.now();
  
//   // If this user has a cached timestamp, check if enough time has passed
//   if (notificationCache[userId]) {
//     const timeElapsed = (now - notificationCache[userId].lastSentTimestamp) / 60000; // Convert to minutes
    
//     if (timeElapsed < user.alertFrequency) {
//       console.log(`Skipping notification for user ${userId} - frequency limit (${user.alertFrequency} min)`);
//       return results;
//     }
//   }
  
//   // Compose the message
//   const detectionTime = new Date(detection.timestamp).toLocaleString();
//   const message = `Wildlife Detection Alert: ${detection.animal} detected at ${detectionTime} with ${Math.round(detection.confidence * 100)}% confidence.`;    // Send notifications based on user preferences
//   try {
//     let smsResult = { skipped: true };
//     let whatsappResult = { skipped: true };
    
//     if (user.notifications.smsAlerts) {
//       smsResult = await sendSMS(user.phoneNumber, message);
//       // Only mark as true if it was actually sent (not skipped)
//       results.sms = !smsResult.skipped;
//     }
    
//     if (user.notifications.whatsappAlerts) {
//       whatsappResult = await sendWhatsApp(user.phoneNumber, message);
//       // Only mark as true if it was actually sent (not skipped)
//       results.whatsapp = !whatsappResult.skipped;
//     }
    
//     // If both SMS and WhatsApp failed due to international restrictions, try fallback
//     if (
//       (!results.sms && smsResult.error === 'International messaging not supported for this destination') ||
//       (!results.whatsapp && whatsappResult.error === 'International messaging not supported for this destination')
//     ) {
//       const fallbackResult = await sendFallbackNotification(user, message);
//       results.fallback = fallbackResult.success;
//     }
    
//     // Update the notification cache timestamp only if at least one notification was sent
//     if (results.sms || results.whatsapp || results.fallback) {
//       notificationCache[userId] = { 
//         lastSentTimestamp: now
//       };
//     }
    
//     return results;  } catch (error) {
//     // If the error is about Twilio configuration, handle it gracefully
//     if (error.message && (
//         error.message.includes('username is required') || 
//         error.message.includes('not configured')
//     )) {
//       console.error('Twilio configuration error:', error.message);
//       return {
//         sms: false,
//         whatsapp: false,
//         configError: true,
//         message: 'Twilio is not properly configured'
//       };
//     }
    
//     // Handle international messaging errors
//     if (error.code === 21606) {
//       console.error('Twilio international messaging error:', error.message);
//       return {
//         sms: false,
//         whatsapp: false,
//         configError: false,
//         internationalError: true,
//         message: 'International messaging not supported for this destination'
//       };
//     }
    
//     console.error('Error in sendDetectionNotification:', error);
//     throw error;
//   }
// };

// /**
//  * Notify all subscribed users about a new detection
//  * @param {Object} detection - Detection data
//  * @returns {Promise<Array>} - Array of notification results
//  */
// export const notifyAllUsers = async (detection) => {
//   try {
//     // Find all users who are subscribed
//     const subscribedUsers = await User.find({ isSubscribed: true });
    
//     console.log(`Notifying ${subscribedUsers.length} subscribed users about detection`);
    
//     const notificationResults = [];
    
//     // Send notifications to each user
//     for (const user of subscribedUsers) {
//       try {
//         const result = await sendDetectionNotification(user, detection);
//         notificationResults.push({
//           userId: user._id,
//           username: user.username,
//           result
//         });
//       } catch (err) {
//         console.error(`Failed to notify user ${user._id}:`, err);
//         notificationResults.push({
//           userId: user._id,
//           username: user.username,
//           error: err.message
//         });
//       }
//     }
    
//     return notificationResults;
//   } catch (error) {
//     console.error('Error in notifyAllUsers:', error);
//     throw error;
//   }
// };
