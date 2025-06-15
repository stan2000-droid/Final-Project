# Wildlife Detection System

This system detects wildlife in video feeds and sends notifications via Twilio when animals are detected.

## Detection Process Flow

1. **Flask Application (`flask_app.py`)**
   - Processes video using YOLO model to detect wildlife
   - Creates detection records with unique IDs
   - Sends detection webhooks to Node.js server

2. **Webhook Utility (`webhook_utils.py`)**
   - Formats detection data for the Node.js server
   - Sends HTTP POST requests to the webhook endpoint
   - Implements rate limiting to avoid notification spam

3. **Node.js Server**
   - Receives detection webhooks at `/api/webhook/detection`
   - Stores detection records in MongoDB
   - Sends notifications to subscribed users via Twilio

## Detection Database Schema

The detection system stores detection information in MongoDB with the following schema:

```javascript
{
  detection_id: String,       // Unique identifier for the detection
  timestamp: Date,            // When the detection occurred (ISO format)
  formatted_time: String,     // Human-readable formatted time
  class_name: String,         // Detected animal type
  confidence: Number,         // Confidence score (0-1)
  boundingBox: [Number],      // [x1, y1, x2, y2] coordinates
}
```

## API Endpoints

### Detections API

- `GET /api/detections` - Get all detections with optional filtering
  - Query params: class_name, start_date, end_date, min_confidence, limit, page
  
- `GET /api/detections/stats` - Get detection statistics
  - Returns counts by class, daily counts, and confidence stats
  
- `GET /api/detections/:id` - Get a specific detection by ID

- `POST /api/detections` - Create a new detection manually

- `DELETE /api/detections/:id` - Delete a detection

### Webhook API

- `POST /api/webhook/detection` - Receive detection webhooks from the Python backend

## Testing the System

To test the detection system:

1. Start the Node.js server:
   ```
   cd server
   npm start
   ```

2. Start the Flask application:
   ```
   python flask_app.py
   ```

3. Upload a video with wildlife to the Flask app

4. The Flask app will automatically detect wildlife and send webhooks to the Node.js server

5. Check the server logs for "Detection saved to database" messages

## Notification System

The system supports multiple notification channels:

1. **SMS via Twilio** - Text messages for critical alerts
2. **WhatsApp via Twilio** - Rich messages with detection details
3. **Browser Push** - Real-time notifications in the web application
4. **Fallback Email** - When SMS/WhatsApp is not available

### International Messaging

For international SMS messaging with Twilio:
1. Upgrade from trial account to paid account
2. Ensure your Twilio phone number is approved for international messaging to your target countries
3. Check Twilio's country-specific regulations

## Configuration

Configure the system by setting environment variables in `.env` files:

### Server Configuration

```
# Server port
PORT=5001

# MongoDB connection string 
MONGO_URL=mongodb://localhost:27017/wildlife-detection

# Twilio configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number_here
```

## Troubleshooting

If you encounter "username is required" errors with Twilio, check:
1. Environment variables are properly loaded
2. Twilio credentials are correct
3. No spaces around equals signs in .env file
4. No quotes around values in .env file

For international messaging errors:
- The system will automatically fall back to alternative notification methods
