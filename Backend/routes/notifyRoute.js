// routes/notifyRoute.js
const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const router = express.Router();

// Twilio setup
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Email setup (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Email + SMS to Donor
router.post('/', async (req, res) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ error: 'Email or phone number required' });
  }

  try {
    const message = `Urgent Blood Request: Someone nearby needs your blood donation. Please log in to the portal for details.`;

    // Send email
    if (email) {
      await transporter.sendMail({
        from: `"Lifesaver Portal" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Urgent Blood Request',
        text: message,
      });
    }

    // Send SMS
    if (phone) {
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
    }

    res.json({ message: 'Notification sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = router;
