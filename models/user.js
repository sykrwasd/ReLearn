const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname:{ type: String, required: true },
  ic:{ type: String, required: true },
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imageUrl: { type: String, required: false },
  access: { type: String, required: false },
});

module.exports = mongoose.model('user', UserSchema);
