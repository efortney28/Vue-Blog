const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    published_date: {
        type: Date,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;