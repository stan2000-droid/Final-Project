import mongoose from "mongoose";

// 1. Define the schema
const detectionSchema = new mongoose.Schema({
    detection_id: {
      type: String,
      required: true,
      unique: true,
    },
    formatted_time: {
      type: String,          // Human-readable formatted time
      required: true,
    },
    class_name: {
      type: String,          // Detected class label (animal type)
      required: true,
    },
    confidence: {
      type: Number,          // Confidence score between 0 and 1
      required: true,
      min: 0,
      max: 1,
    }
  }, 
  { 
    timestamps: true         // Adds createdAt and updatedAt timestamps
  }
);

const Detection = mongoose.model("Detection", detectionSchema);
export default Detection;