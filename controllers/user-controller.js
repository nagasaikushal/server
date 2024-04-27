const User = require('../models/user-model'); 
const bcrypt = require('bcryptjs');

const changePassword = async (req, res) => {
  try {
      const { email, password } = req.body;
      if (!email || !password) {
          return res.status(400).json({ success: false, message: 'Email and new password are required' });
      }
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }
      const isSameAsOldPassword = await bcrypt.compare(password, user.password);
      if (isSameAsOldPassword) {
          return res.status(400).json({ success: false, message: 'New password cannot be the same as your old password.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(user._id, { password: hashedPassword });
      res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ success: false, message: 'An error occurred while changing password' });
  }
};


const getUsersEmails = async (req, res) => {
    try {
      const emailToFind = req.query.email; 
      const users = emailToFind
        ? await User.find({ email: emailToFind }, { email: 1 }) 
        : await User.find({}, { email: 1 });   
      const emails = users.map(user => user.email);
      if (emails.length === 0) {
        return res.status(204).json({ message: 'Email not found' }); 
      }
      return res.status(200).json({ emails });
    } catch (error) {
      console.error(`Error from the getUsersEmails controller: ${error}`);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

module.exports = {
    changePassword,getUsersEmails
};
