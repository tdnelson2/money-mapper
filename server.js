//Install express server
const express = require('express');
const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));

// Set max cache age for service worker to 0 so if it is
// modified, it will replace the old one client side
app.use('/sw.js', (req, res) => res.sendFile(__dirname + '/dist/sw.js', {maxAge: 0}));

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);