import User from "../models/User.js";

export const getUserNotificationSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      notifications: user.notifications,
      alertFrequency: user.alertFrequency
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserNotificationSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { notifications, alertFrequency } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { 
        notifications,
        alertFrequency 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotifiedUsers = async (req, res) => {
  try {
    // Find users who have at least one notification type enabled
    const users = await User.find({
      $or: [
        { 'notifications.popNotifications': true },
        { 'notifications.smsAlerts': true },
        { 'notifications.whatsappAlerts': true }
      ]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
