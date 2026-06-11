const cron = require('node-cron');
const pool = require('./db');

cron.schedule('0 0 * * *', async () => {
    console.log('Checking trip status ...');
    await pool.query(`UPDATE trips SET status = 'completed' WHERE datum_povratka < NOW() AND status = 'active'`);
});

module.exports = cron;