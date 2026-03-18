require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testSignup() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const email = 'test' + Date.now() + '@example.com';
        console.log('Attempting to create user with email:', email);

        const user = new User({
            name: 'Test User',
            email: email,
            password: 'password123'
        });

        await user.save();
        console.log('User created successfully:', user._id);

        // Test duplicate
        console.log('Attempting to create duplicate user...');
        const duplicate = new User({
            name: 'Dup User',
            email: email,
            password: 'password123'
        });
        try {
            await duplicate.save();
        } catch (err) {
            console.log('Duplicate test correctly failed:', err.message);
        }

    } catch (err) {
        console.error('Test Signup Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

testSignup();
