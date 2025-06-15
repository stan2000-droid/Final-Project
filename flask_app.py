import os
import cv2
import numpy as np
from ultralytics import YOLO
from flask import Flask, request, jsonify, render_template, Response, send_from_directory
from flask_cors import CORS
from PIL import Image
import tempfile
import time
import threading
import uuid
import base64
from webhook_utils import process_detections_for_webhook  # Import webhook utilities

# VideoCamera class for handling video processing
class VideoCamera(object):
    def __init__(self, video_path=None):
        """Initialize the camera with a video path
        
        Args:
            video_path (str, optional): Path to the video file. If None, uses webcam.
        """
        # Store the video path
        self.video_path = video_path
        
        # If video_path is None or empty, default to webcam (0)
        if not video_path:
            print("No video path provided, attempting to use default camera")
            self.video = cv2.VideoCapture(0)
        else:
            # Check if the file exists
            if os.path.exists(video_path):
                print(f"Opening video: {video_path}")
                self.video = cv2.VideoCapture(video_path)
            else:
                print(f"Warning: Video file not found: {video_path}")
                self.video = cv2.VideoCapture(video_path)  # Still try to open it
          # Check if video is opened successfully
        if not self.video.isOpened():
            print(f"Error: Could not open video source: {video_path}")
        
        self.detection_in_progress = False
        # Load the YOLO model (using the global model instance)
        self.model = model
        self.confidence = 0.5  # Default confidence threshold
        self.sample_rate = 1   # Default sample rate
        self.frame_count = 0   # Counter for sample rate implementation
        self.detection_data = []  # List to store detection information
        self.latest_frame = None  # Store the latest processed frame

    def __del__(self):
        """Cleanup method to release video resources"""
        if hasattr(self, 'video') and self.video is not None:
            self.video.release()
            print(f"VideoCamera released: {self.video_path}")
    
    def release(self):
        """Explicit method to release video resources"""
        if hasattr(self, 'video') and self.video is not None:
            self.video.release()
            self.video = None
            print(f"VideoCamera released: {self.video_path}")

    def get_frame(self):
        ret, frame = self.video.read()
        if not ret:
            return None
        
        # Process the frame with YOLO detection if needed
        return frame

    def get_processed_frame(self):
        """Get a frame with YOLO detection results drawn on it"""
        global inference_should_stop
        
        # Check if inference should stop
        if inference_should_stop:
            return None
            
        # Increment frame counter
        self.frame_count += 1
        
        # Get a frame
        frame = self.get_frame()
        if frame is None:
            return None
        
        # Only process every Nth frame based on sample rate
        if self.frame_count % self.sample_rate != 0:
            return frame
        
        # Perform detection with specified confidence
        results = self.model.predict(frame, imgsz=640, conf=self.confidence)[0]
        
        # Store the current timestamp
        current_time = time.time()
        formatted_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(current_time))
          # Clear previous detections data for this frame
        new_detections = []
        
        # Draw detections
        for *box, conf, cls_id in results.boxes.data.tolist():
            x1, y1, x2, y2 = map(int, box)
            cls_name = self.model.names[int(cls_id)]
            label = f"{cls_name} {conf:.2f}"
            
            # Draw bounding box
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            
            # Draw label with background
            text_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 1)[0]
            cv2.rectangle(frame, (x1, y1 - text_size[1] - 10), (x1 + text_size[0], y1), (0, 255, 0), -1)
            cv2.putText(frame, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 1)
            
            # Extract and store detection info if confidence is above threshold
            if conf >= self.confidence:
                # Crop the detection area
                detection_img = frame[y1:y2, x1:x2].copy()
                
                # Convert the cropped detection to JPEG format
                _, detection_jpeg = cv2.imencode('.jpg', detection_img)
                detection_base64 = detection_jpeg.tobytes()
                
                # Create a unique ID for this detection
                detection_id = f"{int(current_time * 1000)}_{len(new_detections)}"
                
                # Store detection info
                detection_info = {
                    'id': detection_id,
                    'timestamp': current_time,
                    'formatted_time': formatted_time,
                    'class_name': cls_name,
                    'confidence': float(conf),
                    'bbox': [x1, y1, x2, y2],
                    'image_data': detection_base64
                }
                
                new_detections.append(detection_info)
        
        # Process new detections for webhook if there are any
        if new_detections:
            # Process detections for webhook in a separate thread to avoid blocking
            webhook_thread = threading.Thread(
                target=process_detections_for_webhook,
                args=(new_detections,)
            )
            webhook_thread.daemon = True
            webhook_thread.start()
        
        # Keep only the latest detections (up to 50)
        self.detection_data.extend(new_detections)
        if len(self.detection_data) > 50:
            self.detection_data = self.detection_data[-50:]
        
        # Store the latest processed frame
        self.latest_frame = frame
        
        return frame

    def get_jpeg_frame(self):
        """Get the current frame as a JPEG bytestring"""
        frame = self.get_frame()
        if frame is None:
            return None
        ret, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes()
    
    def get_processed_jpeg_frame(self):
        """Get a processed frame with detections as a JPEG bytestring"""
        frame = self.get_processed_frame()
        if frame is None:
            return None
        ret, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes()
        
    def get_detections(self, limit=10):
        """Get the latest detections
        
        Args:
            limit (int): Maximum number of detections to return
            
        Returns:
            list: List of detection dictionaries
        """
        return self.detection_data[-limit:] if self.detection_data else []
        
    def get_detection_by_id(self, detection_id):
        """Get a specific detection by ID
        
        Args:
            detection_id (str): The unique ID of the detection
            
        Returns:
            dict: Detection information or None if not found
        """
        for detection in self.detection_data:
            if detection['id'] == detection_id:
                return detection
        return None

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create upload directory if it doesn't exist
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load the YOLO model
print("Loading YOLOv11 model from best.pt...")
model = YOLO('best.pt')  # Load your YOLOv11 model
print("Model loaded successfully!")
def gen(camera):
    """Generate video frames for streaming. Uses frames already processed by background inference."""
    global inference_should_stop
    while True:
        # Check if inference should stop
        if inference_should_stop:
            print("Video streaming stopped by user request")
            break
            
        # Get the latest processed frame instead of processing in real-time
        if camera.latest_frame is not None:
            ret, jpeg = cv2.imencode('.jpg', camera.latest_frame)
            frame = jpeg.tobytes()
        else:
            # If no processed frame available, get a regular frame
            frame = camera.get_processed_jpeg_frame()
            
        if frame is None:
            # If no frame is available, send a placeholder or break
            time.sleep(0.1)
            continue
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

def background_inference(camera):
    """Background inference function that processes video without streaming"""
    global inference_should_stop
    print("Starting background inference...")
    
    while not inference_should_stop and camera is not None:
        # Process frame in background to populate detection data
        frame = camera.get_processed_frame()
        if frame is None:
            print("No more frames available, stopping background inference")
            break
        # Small delay to prevent overwhelming the system
        time.sleep(0.033)  # ~30 FPS processing rate
    
    print("Background inference stopped")
               
@app.route('/video_feed')
def video_feed():
    global active_camera
    
    # If no active camera exists, create one with a default source
    if active_camera is None:
        return "No active camera feed. Please upload a video first."
        
    return Response(gen(active_camera),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# Global variables
active_camera = None
inference_should_stop = False
inference_thread = None
inference_thread = None

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """API endpoint to receive video uploads from the React frontend"""
    global active_camera, inference_thread, inference_thread, inference_should_stop
    
    # Check if file was included in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    # Check if a valid file was selected
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Validate file type (optional)
    valid_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in valid_extensions:
        return jsonify({'error': f'Invalid file type. Supported types: {", ".join(valid_extensions)}'}), 400
    
    try:
        # Get confidence threshold from request (default to 0.5)
        confidence = float(request.form.get('confidence', 0.5))
        
        # Get sample rate from request (default to 1)
        sample_rate = int(request.form.get('sample_rate', 1))
        
        # Generate a unique ID for this upload
        upload_id = str(uuid.uuid4())
        
        # Create a path for the uploaded file
        upload_filename = f"{upload_id}{file_ext}"
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], upload_filename)
          # Save the file
        file.save(upload_path)
        
        # If there's an existing active camera, close it
        if active_camera is not None:
            active_camera.release()
        
        # Create a new camera with the uploaded video
        active_camera = VideoCamera(upload_path)
        
        # Reset inference stop flag when starting new upload
        inference_should_stop = False
          # Setup detection parameters
        active_camera.confidence = confidence
        active_camera.sample_rate = sample_rate
          # Start background inference immediately after upload
        inference_thread = threading.Thread(target=background_inference, args=(active_camera,))
        inference_thread.daemon = True
        inference_thread.start()
        print(f"Started background inference for video: {file.filename}")
        
        # Return the streaming URL and upload ID
        stream_url = f"/video_feed"
        
        return jsonify({
            'message': 'File uploaded successfully',
            'upload_id': upload_id,
            'stream_url': stream_url,
            'filename': file.filename
        }), 200
    except Exception as e:
        return jsonify({'error': f'Error processing upload: {str(e)}'}), 500

@app.route('/api/stop_detection', methods=['POST'])
def stop_detection():
    """API endpoint to stop active detection"""
    global active_camera, inference_should_stop, inference_thread
    
    # Set the stop flag
    inference_should_stop = True
    
    # Wait for inference thread to finish
    if inference_thread and inference_thread.is_alive():
        inference_thread.join(timeout=2.0)  # Wait up to 2 seconds
    
    if active_camera is not None:
        active_camera.release()
        active_camera = None
        return jsonify({'message': 'Detection stopped successfully'}), 200
    else:
        return jsonify({'message': 'No active detection to stop'}), 200

@app.route('/api/detections', methods=['GET'])
def get_detections():
    """API endpoint to retrieve detection information"""
    global active_camera
    
    # Check if there's an active camera
    if active_camera is None:
        return jsonify({'error': 'No active detection session'}), 404
    
    # Get the limit parameter from the query string (default to 10)
    limit = request.args.get('limit', default=10, type=int)
    
    # Get the latest detections
    detections = active_camera.get_detections(limit=limit)
    
    # Format the detections for JSON response
    formatted_detections = []
    for detection in detections:
        # Convert binary image data to base64 string for JSON transmission
        image_base64 = base64.b64encode(detection['image_data']).decode('utf-8')
        
        formatted_detections.append({
            'id': detection['id'],
            'timestamp': detection['timestamp'],
            'formatted_time': detection['formatted_time'],
            'class_name': detection['class_name'],
            'confidence': detection['confidence'],
            'bbox': detection['bbox'],
            'image': f"data:image/jpeg;base64,{image_base64}"
        })
    
    return jsonify({
        'count': len(formatted_detections),
        'detections': formatted_detections
    }), 200

@app.route('/api/detections/<detection_id>', methods=['GET'])
def get_detection(detection_id):
    """API endpoint to retrieve a specific detection"""
    global active_camera
    
    # Check if there's an active camera
    if active_camera is None:
        return jsonify({'error': 'No active detection session'}), 404
    
    # Get the detection by ID
    detection = active_camera.get_detection_by_id(detection_id)
    
    # Check if the detection exists
    if not detection:
        return jsonify({'error': f'Detection with ID {detection_id} not found'}), 404
    
    # Convert binary image data to base64 string for JSON transmission
    image_base64 = base64.b64encode(detection['image_data']).decode('utf-8')
    
    # Format the detection for JSON response
    formatted_detection = {
        'id': detection['id'], 
        'formatted_time': detection['formatted_time'],
        'class_name': detection['class_name'],
        'confidence': detection['confidence'],
        'image': f"data:image/jpeg;base64,{image_base64}"
    }
    
    return jsonify(formatted_detection), 200

@app.route('/api/stop_inference', methods=['POST'])
def stop_inference():
    """API endpoint to stop inference processing"""
    global inference_should_stop, active_camera, inference_thread
    
    # Set the stop flag to halt video processing
    inference_should_stop = True
    print("Stop inference requested")
    
    # Wait for inference thread to finish
    if inference_thread and inference_thread.is_alive():
        print("Waiting for inference thread to stop...")
        inference_thread.join(timeout=2.0)  # Wait up to 2 seconds
        print("Inference thread stopped")
    
    # Also stop the active camera if it exists
    if active_camera is not None:
        active_camera.release()
        active_camera = None
    
    return jsonify({"success": True, "message": "Inference stopped successfully."}), 200

if __name__ == '__main__':
    print("Starting YOLOv11 Wildlife Detection Flask application...")
    print("Visit http://127.0.0.1:5000/ to access the application")
    
    # Start Flask app
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True, use_reloader=False)
