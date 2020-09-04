const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
// Order of requires matters
require('./models/User');
// Since passport doesnt export anything we just require it
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

// Adding body-parser middleware
app.use(bodyParser.json());
//Adding cookies middleware
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
// We use initialize and session to apply middleware to passport
app.use(passport.initialize());
app.use(passport.session());

// Shorthand syntax instead of naming an export
// would be equal to const authRoutes = require...
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

// Production routing
if (process.env.NODE_ENV === 'production') {
  //Serving main.js and main.css
  app.use(express.static('client/build'));
  // Serve index.html for anything else
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Port that heroku will give us in runtime
const PORT = process.env.PORT || 5000;
app.listen(PORT);

// STEPS FOR OAUTH
// 1. Create new strategy (this case google), use passport.authenticate in the desired route to use it.
// 2. Add user to database or dont.
// 3. Turn user into cookie by its document id (passport.serializeUser/deserializeUser)
// 4. Apply cookie-session middleware to passport (passport.initialize()/session())
