const db = require(process.cwd() + '/models');

exports.follow = async (req, res, next) => {
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE id=?', [req.user.id]);
        if (rows.length > 0) {
            const user = rows[0];
            await db.execute('INSERT IGNORE INTO follow (followerId, followingId) VALUES (?, ?)',
                [req.user.id, req.params.id]);
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
};