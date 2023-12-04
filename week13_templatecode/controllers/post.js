const db = require(process.cwd() + '/models');

exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
    try {
        const [postInsertResult] = await db.execute('INSERT INTO posts (content, img, userId) VALUES (?, ?, ?)',
            [req.body.content, req.body.url, req.user.id]);
        const [posts] = await db.execute('SELECT * FROM posts WHERE id=?', [postInsertResult.insertId]);
        const post = posts[0];

        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            await Promise.all(
                hashtags.map(async t => {
                    const tag = t.slice(1).toLowerCase();
                    const [tagInsertResult] = await db.execute('INSERT INTO hashtags (title) VALUES (?) ON DUPLICATE KEY UPDATE updatedAt=now();', [tag]);
                    db.execute('INSERT INTO postHashtag (postId, hashtagId) VALUES (?, ?)',
                        [post.id, tagInsertResult.insertId]);
                })
            );
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/* Todo */
exports.deletePost = async (req, res, next) => {
    try {
        const idToDelete = parseInt(req.params.id);
        const [post] = await db.execute('SELECT * FROM posts WHERE id=?', [idToDelete]);
        if (post[0].userId !== req.user.id) {
            return res.status(403).send('삭제 권한이 없습니다.');
        }
        await db.execute('DELETE FROM posts WHERE id=?', [idToDelete]);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.likePost = async (req, res, next) => {
    try {
        const idToLike = req.params.userId;
        const [post] = await db.execute('SELECT * FROM posts WHERE id=?', [idToLike]);
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        await db.execute('INSERT INTO postLikes (userId, postId) VALUES (?, ?)', [req.user.id, idToLike]);
        res.json({ userId: req.user.id, postId: idToLike });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.unlikePost = async (req, res, next) => {
    try {
        const {postId, userId} = req.params;
        const [post] = await db.execute('SELECT * FROM posts WHERE id=?', [postId]);
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        await db.execute('DELETE FROM postLikes WHERE userId=? AND postId=?', [userId, postId]);
        res.json({ userId: req.user.id, postId: postId });
    } catch (err) {
        console.error(err);
        next(err);
    }
}