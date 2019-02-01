const errors = require('restify-errors');
const rjwt = require('restify-jwt-community');
const Post = require('../models/Post');
const config = require('../config');

module.exports = server => {
    // Get Posts
    server.get('/api/posts', async (req, res, next) => {
        try {
            const posts = await Post.find({});
            res.send(posts);
            next();
        } catch (err) {
            return next(new errors.InvalidContentError(err));
        }
    });

    // Get Single Post
    server.get('/api/posts/:id', async (req, res, next) => {
        try {
            const post = await Post.findById(req.params.id);
            res.send(post);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(
                `There is no post with the id of ${req.params.id}`
            ));
        }
    });

    // Add Post
    server.post('/api/posts/new', async (req, res, next) => {
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json"));
        }
        const { title, body, published_date, author } = req.body;

        const post = new Post({ title, body, published_date, author});
        
        try {
            const newPost = await post.save();
            res.send(201);
            next();
        } catch (err) {
            return next(new errors.InternalError(err.message));
        }
    });

    // Edit Post
    server.put('/api/posts/:id', async (req, res, next) => {
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json"));
        }

        try {
            const post = await Post.findOneAndUpdate({_id: req.params.id}, req.body);
            res.send(200);
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`There is no post with the id of ${req.params.id}`));
        }
    });

    // Delete Post 
    server.del('/api/posts/:id', async (req, res, next) => {
        try {
            const post = await Post.findOneAndRemove({_id: req.params.id});
            res.send(204);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`There is no post with the id of ${req.params.id}`));
        }
    });
}