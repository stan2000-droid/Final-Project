import User from "../models/User.js";


export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {  try {
    const {
      username,
      name,
      surname,
      email,
      phoneNumber,
      smsAlerts,
      popNotifications,
      whatsappAlerts,
      alertFrequency,
      isSubscribed
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.username === username 
          ? "Username already exists" 
          : "Email already exists"
      });
    }

    // Convert alertFrequency from string to number
    const frequencyMap = {
      '2min': 2,
      '5min': 5,
      '10min': 10,
      '30min': 30,
      '1hr': 60
    };    const newUser = new User({
      username,
      name,
      surname,
      email,
      phoneNumber,
      notifications: {
        smsAlerts,
        popNotifications,
        whatsappAlerts
      },
      alertFrequency: frequencyMap[alertFrequency],
      isSubscribed: true  // Set isSubscribed to true when creating a new user
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      errors: error.errors 
    });
  }
};


export const unsubscribeUser = async (req, res) => {
  try {
    const { username, phoneNumber, deleteData } = req.body;
    
    // Find user by username or phone number
    const user = await User.findOne({
      $or: [
        { username: username },
        { phoneNumber: phoneNumber }
      ]
    });

    if (!user) {
      const errors = [];
      if (username) errors.push("username");
      if (phoneNumber) errors.push("phoneNumber");
      return res.status(404).json({ 
        success: false, 
        message: "Authentication failed", 
        invalidFields: errors 
      });
    }

    // Update user subscription status
    user.isSubscribed = false;
    
    if (deleteData) {
      // Delete user data
      await User.findByIdAndDelete(user._id);
      return res.status(200).json({ 
        success: true, 
        message: "User unsubscribed and data deleted successfully",
        deleteData: true
      });
    } else {
      // Just update subscription status
      await user.save();
      return res.status(200).json({ 
        success: true, 
        message: "User unsubscribed successfully",
        deleteData: false
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
