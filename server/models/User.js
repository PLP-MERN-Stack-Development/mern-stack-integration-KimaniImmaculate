// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
