const db = require('../config/database');

class Click {
    static async create(clickData) {
        const { link_url, link_title, ip_address } = clickData;
        const [result] = await db.execute(
            'INSERT INTO clicks (link_url, link_title, ip_address) VALUES (?, ?, ?)',
            [link_url, link_title, ip_address]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM clicks ORDER BY clicked_at DESC');
        return rows;
    }

    static async getCount() {
        const [rows] = await db.execute('SELECT COUNT(*) as total FROM clicks');
        return rows[0].total;
    }
}

module.exports = Click;