const mongoose = require('mongoose');

const localUri = 'mongodb://localhost:27017/hiremind';

console.log('Testing Local MongoDB connection with URI:', localUri);

mongoose.connect(localUri, {
    serverSelectionTimeoutMS: 2000
})
.then(() => {
    console.log('SUCCESS: Connected to LOCAL MongoDB');
    process.exit(0);
})
.catch(err => {
    console.error('ERROR: Could not connect to LOCAL MongoDB:', err.message);
    process.exit(1);
});
