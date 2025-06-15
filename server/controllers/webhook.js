//import { notifyAllUsers } from '../services/notificationService.js';
import Detection from '../models/Detection.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Handle incoming detection webhook from Flask backend
 * This endpoint receives detection data and sends notifications to subscribed users
 */
export const handleDetectionWebhook = async (req, res) => {
  try {
    const detection = req.body;
    
    // Validate the incoming detection data
    if (!detection || !detection.animal || !detection.confidence || !detection.formatted_time) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid detection data' 
      });
    }
    
    console.log('Received detection webhook:', detection);
      // Create a detection record in the database
    try {
      const detection_id = detection.id ;
      const formatted_time = detection.formatted_time;        
      const detectionRecord = new Detection({
        detection_id,
        formatted_time,
        class_name: detection.animal,
        confidence: parseFloat(detection.confidence),
      });
      
      await detectionRecord.save();
      console.log('Detection saved to database with ID:', detection_id);
    } catch (dbError) {
      console.error('Error saving detection to database:', dbError);
      // Continue even if database save fails
    }
      // Process the detection and notify users asynchronously
    // We don't want to block the response waiting for all notifications to be sent
    // TODO: Implement notification service when needed
    // notifyAllUsers(detection)
    //   .then(results => {
    //     console.log('Notification results:', results);
    //   })
    //   .catch(error => {
    //     console.error('Error sending notifications:', error);
    //   });
    
    // Respond immediately with success
    return res.status(200).json({ 
      success: true, 
      message: 'Detection received, notifications will be sent'
    });
  } catch (error) {
    console.error('Error in detection webhook:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
