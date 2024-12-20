// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');

// Import Routes
const apiRoutes = require('./routes/apiRoutes');

// Initialize the app
const app = express();

// Middleware
app.use(helmet());         // Secure HTTP headers
app.use(cors());           // Handle cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON
app.use(morgan('combined')); // Logging requests to the console

// Routes

// echo request body
app.use((req, res, next) => {
  console.log(req.body);
  next();
});

app.use('/api/v1/', apiRoutes);

// Catch 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app;