import mongoose from 'mongoose'
import crypto from 'crypto'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,// Remove whitespace from both ends of the string
    required: 'Name is required'
  },
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required'
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  hashed_password: {
    type: String,
    required: 'Password is required'
  },
  salt: String
});
// Virtual property for password
UserSchema.virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();// Generate a new salt
    this.hashed_password = this.encryptPassword(password)//Encrypt the password
  })
  .get(function () {
    return this._password;
  });

UserSchema.path('hashed_password').validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.');
  }
  // Validate password presence if this is a new document
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required');
  }
}, null);

UserSchema.methods = {
  authenticate: function (plainText) {
    // Compare hashed passwords
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function (password) {
    if (!password) return ''
    try {
      // Create HMAC (Hash-based Message Authentication Code) using the salt and SHA1 algorithm
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
  // Method to generate a salt
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  }
}

export default mongoose.model('User', UserSchema);

