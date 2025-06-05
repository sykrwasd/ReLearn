const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  review: { type: String, required: true },
  rating: { type: Number, required: true },
  username: { type: String, required: true },
  sellerid : {type: String, required: true}
});

module.exports = mongoose.model('feedback', FeedbackSchema);
