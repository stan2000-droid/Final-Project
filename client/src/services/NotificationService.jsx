import { api } from '../state/api';
import store from '../state';

/**
 * Client-side notification service
 * Handles browser push notifications only
 * SMS and WhatsApp notifications are handled by the server
 */
class NotificationService {
  constructor() {
    this.lastNotificationTimes = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Check if browser notifications are supported
      if ('Notification' in window) {
        // If permission is already granted, we're good to go
        if (Notification.permission === 'granted') {
          console.log('Browser notifications are enabled');
        } 
        // If permission is not denied, we can ask when needed
        else if (Notification.permission !== 'denied') {
          console.log('Browser notifications permission can be requested');
        }
        // If permission is denied, we can't show notifications
        else {
          console.log('Browser notifications are denied');
        }
      } else {
        console.log('This browser does not support desktop notification');
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }

  /**
   * Request permission for browser notifications
   * @returns {Promise<boolean>} Whether permission was granted
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Send a browser push notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {string} imageUrl - Optional image URL to show in notification
   * @returns {Promise<boolean>} Whether the notification was sent
   */
  async sendPushNotification(title, message, imageUrl = null) {
    if (!this.initialized) {
      await this.initialize();
    }

    // If notifications aren't supported, return false
    if (!('Notification' in window)) {
      return false;
    }

    // If we don't have permission, try to request it
    if (Notification.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        return false;
      }
    }

    try {
      // Create notification options
      const options = {
        body: message,
        icon: '/logo192.png', // Default app icon
        badge: '/logo192.png',
        timestamp: Date.now()
      };

      // Add image if provided
      if (imageUrl) {
        options.image = imageUrl;
      }

      // Create and show the notification
      const notification = new Notification(title, options);
      
      // Add click handler to open the app
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  /**
   * Check if a user should be notified based on their frequency preferences
   * @param {Object} user - User document with notification preferences
   * @param {number} lastNotificationTime - Timestamp of last notification
   * @returns {boolean} - Whether the user should be notified
   */
  shouldNotify(user, lastNotificationTime) {
    const now = Date.now();
    const frequencyInMs = user.alertFrequency * 60 * 1000; // Convert minutes to milliseconds
    return !lastNotificationTime || (now - lastNotificationTime) >= frequencyInMs;
  }

  /**
   * Process a new detection and show browser notification if appropriate
   * @param {Object} detection - Detection data from backend
   * @returns {Promise<Object>} - Results of notification attempt
   */
  async handleDetection(detection) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Get the current user from store if available
      const state = store.getState();
      const currentUser = state?.auth?.user;
      
      if (!currentUser) {
        return { success: false, reason: 'no_current_user' };
      }
      
      // Only show notification if user has subscribed and enabled pop notifications
      if (currentUser.isSubscribed && 
          currentUser.notifications && 
          currentUser.notifications.popNotifications) {
        
        // Check notification frequency
        if (this.shouldNotify(currentUser, this.lastNotificationTimes.get(currentUser._id))) {
          // Format the message
          const title = 'Wildlife Detection Alert';
          const message = `${detection.class_name || 'Wildlife'} detected with ${Math.round((detection.confidence || 0) * 100)}% confidence`;
          
          // Send browser notification
          const success = await this.sendPushNotification(
            title,
            message,
            detection.image
          );
          
          if (success) {
            // Update last notification time
            this.lastNotificationTimes.set(currentUser._id, Date.now());
            return { 
              success: true, 
              user: currentUser._id,
              notificationType: 'browser' 
            };
          }
        } else {
          return { 
            success: false, 
            reason: 'frequency_limit',
            user: currentUser._id 
          };
        }
      }
      
      return { 
        success: false, 
        reason: 'notifications_disabled',
        user: currentUser._id 
      };
    } catch (error) {
      console.error('Error handling detection for notifications:', error);
      return { 
        success: false, 
        reason: 'error',
        error: error.message 
      };
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();
export default notificationService;