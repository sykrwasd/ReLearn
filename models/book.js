const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  username: { type: String, required: true },
  bookAuthor: { type: String, required: true },
  bookTitle: { type: String, required: true },
  faculty: { type: String, required: true },
  condition: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: false },
  availability: { type: String, required: true }, 
  buyerid : {type: String, required: true}
});

module.exports = mongoose.model('book', BookSchema);
