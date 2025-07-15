const mongoose = require('mongoose');

const kidSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // owner
});

const Kid = mongoose.model('Kid', kidSchema);
module.exports = Kid;
