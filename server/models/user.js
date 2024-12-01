const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false, // Ensures password is not returned by default
  },
  role: {
    type: String,
    enum: ['customer', 'vendor'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to compare entered password with stored password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // Since passwords are stored in plain text, a simple comparison suffices
  return enteredPassword === this.password;
};

module.exports = mongoose.model('User', UserSchema);
