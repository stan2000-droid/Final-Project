# 🐾 Wildlife Detection & Monitoring System

A comprehensive AI-powered wildlife surveillance platform that automatically detects and classifies animals in video feeds using YOLOv11 deep learning technology. Built for conservation organizations, researchers, and wildlife management professionals.

## 🌟 Key Features

- **🤖 AI-Powered Detection**: Real-time wildlife detection using YOLOv11 model with high accuracy
- **📱 Multi-Channel Notifications**: SMS, email, and audio alerts for instant wildlife activity updates
- **📊 Interactive Analytics**: Live dashboards with detection statistics, trends, and breakdowns
- **📹 Video Processing**: Support for both live camera feeds and uploaded video files
- **🔔 Smart Alerting**: Rate-limited notifications to prevent spam while ensuring critical alerts
- **👥 User Management**: Subscription-based notification preferences and user authentication

## 🏗️ Architecture

### Frontend (React.js)
- Modern React application with Material-UI components
- Real-time data visualization with Nivo charts
- Interactive detection canvas with overlay visualization
- Responsive design for desktop and mobile devices

### Backend Services

#### Node.js API Server (`server/`)
- RESTful API for user management and data persistence
- MongoDB integration for storing detection records
- Twilio integration for SMS/WhatsApp notifications
- File upload handling for video processing

#### Python AI Engine (`flask_app.py`)
- Flask-based computer vision processing server
- YOLOv11 model integration for object detection
- OpenCV for video frame processing
- Real-time webhook communication with Node.js backend

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.11 or higher)
- **MongoDB** (local or cloud instance)
- **Twilio Account** (for SMS notifications)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/stan2000-droid/Final-Project.git
cd Final-Project
```

### 2. Setup Python Environment
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install Python dependencies
pip install flask flask-cors opencv-python ultralytics pygame requests
```

### 3. Setup Node.js Backend
```bash
cd server
npm install
```

### 4. Setup React Frontend
```bash
cd ../client
npm install
```

### 5. Configure Environment Variables

Create `.env` files in the respective directories:

**`server/.env`:**
```env
MONGODB_URL=mongodb://localhost:27017/wildlife-detection
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
PORT=5001
```

**Root directory `.env` (for Python):**
```env
WEBHOOK_URL=http://localhost:5001/api/webhook/detection
```

## 🎯 Usage

### Starting the Application

1. **Start MongoDB** (if running locally)
2. **Start the Node.js Backend:**
   ```bash
   cd server
   npm run dev
   ```

3. **Start the Python AI Engine:**
   ```bash
   python flask_app.py
   ```

4. **Start the React Frontend:**
   ```bash
   cd client
   npm start
   ```

The application will be available at:
- Frontend: `http://localhost:3000`
- Node.js API: `http://localhost:5001`
- Python AI Engine: `http://localhost:5000`

### Using the System

1. **Dashboard**: View real-time detection statistics and analytics
2. **Camera Feed**: Monitor live video feeds with detection overlays
3. **Upload Videos**: Process recorded wildlife footage for analysis
4. **Notifications**: Subscribe to SMS/email alerts for specific locations
5. **Analytics**: Review historical detection data and trends

## 📊 API Endpoints

### Detection API
- `POST /api/detections` - Store new detection data
- `GET /api/detections/stats` - Get detection statistics
- `GET /api/detections/breakdown` - Get species breakdown data

### User Management
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `PUT /api/users/preferences` - Update notification preferences

### Notifications
- `POST /api/notifications/subscribe` - Subscribe to notifications
- `DELETE /api/notifications/unsubscribe` - Unsubscribe from notifications

### File Upload
- `POST /api/upload` - Upload video files for processing

## 🔧 Configuration

### AI Model Settings
- **Confidence Threshold**: Adjust detection sensitivity (default: 0.5)
- **Model Path**: Configure YOLOv11 model file location
- **Processing Frame Rate**: Set video processing speed

### Notification Settings
- **Rate Limiting**: Prevent notification spam (configurable intervals)
- **Alert Channels**: Enable/disable SMS, email, or audio notifications
- **User Preferences**: Per-user notification customization

## 📁 Project Structure

```
Final-Project/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── scenes/         # Page components
│   │   ├── services/       # API service handlers
│   │   └── state/          # Redux state management
│   └── public/
├── server/                 # Node.js backend API
│   ├── controllers/        # Route handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route definitions
│   └── services/          # Business logic services
├── uploads/               # Video file storage
├── flask_app.py          # Python AI processing engine
├── webhook_utils.py      # Webhook communication utilities
├── Audio.mp3            # Detection notification sound
├── best.pt              # YOLOv11 model weights
└── README.md            # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Model Loading Errors**: Ensure `best.pt` file is in the root directory
2. **MongoDB Connection**: Verify MongoDB is running and connection string is correct
3. **Audio Issues**: Check that `Audio.mp3` exists and pygame is properly installed
4. **Twilio Errors**: Verify Twilio credentials and phone number format

### Performance Tips

- Use GPU acceleration for faster AI processing (install CUDA-compatible PyTorch)
- Optimize video resolution for better processing speed
- Configure appropriate confidence thresholds to reduce false positives


**Built with ❤️ for wildlife conservation and research**

