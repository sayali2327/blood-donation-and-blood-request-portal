// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/blood_donation')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// User Schema (works for Donor + Recipient)
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodGroup: String, // optional for recipient
  phoneNumber: String,
  role: { type: String, enum: ['donor', 'recipient'], required: true }
});
const User = mongoose.model('User', userSchema);

// REGISTER
app.post('/api/register', async (req, res) => {
  const { fullName, email, password, bloodGroup, phoneNumber, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      bloodGroup,
      phoneNumber,
      role
    });

    await user.save();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('❌ Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create token
    const token = jwt.sign({ id: user._id, email: user.email }, 'secret_key', { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        bloodGroup: user.bloodGroup,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
