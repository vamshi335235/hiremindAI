const bcrypt = require('bcryptjs');

async function test() {
    try {
        console.log('Starting bcrypt hash...');
        const hash = await bcrypt.hash('password123', 8);
        console.log('Hash successful:', hash);
        const match = await bcrypt.compare('password123', hash);
        console.log('Comparison successful:', match);
    } catch (err) {
        console.error('Bcrypt error:', err);
    }
}

test();
