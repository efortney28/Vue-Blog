const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

module.exports = server => {
    // Register User
    server.post('/api/user/register', async (req, res, next) => {

        const { name, email, password } = req.body;
        const user = new User({ name, email, password });

        try {
            const newUser = await user.save();
            res.send(201);
            next();
        } catch (err) {
            return next(new errors.InternalError(err.message));
        }
    });
};