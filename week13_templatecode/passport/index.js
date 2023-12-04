const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const db = require(process.cwd() + '/models');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const [rows] = await db.execute('SELECT id, nick FROM users WHERE id=?', [id]);
            if (rows.length > 0) {
                const user = rows[0];
                const [followings] = await db.execute('SELECT u.id, u.nick FROM users u, follow f WHERE f.followerId=? AND u.id=f.followingId', [user.id]);
                const [followers] = await db.execute('SELECT u.id, u.nick FROM users u, follow f WHERE f.followingId=? AND u.id=f.followerId', [user.id]);
                user.followings = followings;
                user.followers = followers;
                done(null, user);
            } else done(null);
        } catch (err) {
            console.error(err);
            done(err);
        }
    });

    local();
    //kakao();
}