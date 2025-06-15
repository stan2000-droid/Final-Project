import mongoose from "mongoose";

  // Embed without its own _id :contentReference[oaicite:7]{index=7}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,      // Enforce unique usernames
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address']
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\+?[0-9]{7,15}$/, 'Please fill a valid phone number']
  },
  notifications: {
    popNotifications: {
      type: Boolean,
      default: false
    },
    smsAlerts: {
      type: Boolean,
      default: false
    },
    whatsappAlerts: {
      type: Boolean,
      default: false
    }
    
  },
  alertFrequency: {
    type: Number,
    enum: [2, 5, 10, 30, 60],
    required: true
  },
  isSubscribed: {
  type: Boolean,
  default: false
}
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;
