require('dotenv').config();
const pool = require('./config/db');

async function sync() {
    try {
        // Sync fullname and image from users to employees for all employee-role users
        const [result] = await pool.query(`
            UPDATE employees e 
            INNER JOIN users u ON e.email = u.email 
            SET e.fullname = u.fullname, e.image = u.profile_image
        `);
        console.log(`Synced ${result.affectedRows} employee records with user data.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

sync();
