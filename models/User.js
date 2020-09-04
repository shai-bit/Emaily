const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  credits: { type: Number, default: 0 },
});

// First argument:  name of the collection, Second argument: schema
mongoose.model('users', userSchema);
