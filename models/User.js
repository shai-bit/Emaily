const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
});

// First argument:  name of the collection, Second argument: schema
mongoose.model('users', userSchema);
