const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection with URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000 // Timeout after 5s
})
.then(() => {
    console.log('SUCCESS: Connected to MongoDB');
    process.exit(0);
})
.catch(err => {
    console.error('ERROR: Could not connect to MongoDB:', err.message);
    process.exit(1);
});
