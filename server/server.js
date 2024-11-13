const express = require('express');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

// Serve files from the 'uploads' directory under '/uploads' route
app.use('/uploads', express.static("uploads"));

// Define API routes after setting up middleware
app.use('/user', require('./Router/userRouter'));
app.use('/api', require('./Router/categoryRouter'));
app.use('/api', require('./Router/uploadRouter')); // Ensure this route works correctly with multer
app.use('/api', require('./Router/productsRouter'));

// Basic route
app.get('/', (req, res) => {
    return res.json({ msg: "getting send" });
});

// Connect to MongoDB
const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {})
    .then(() => {
        console.log('database connected');
    })
    .catch((err) => {
        console.log(err);
    });

// Start the server
app.listen(port, () => {
    console.log(`process started at ${port}`);
});
