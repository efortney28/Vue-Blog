const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const auth = require('../auth');

module.exports = server => {
    // Register User
    server.post('/api/user/register', (req, res, next) => {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, async (err, hash) => {
                // Hash password
                user.password = hash;
                
                //Save user
                try {
                    const newUser = await user.save();
                    res.send(201);
                    next();
                } catch (err) {
                    return next(new errors.InternalError(err.message));
                }
            })
        })

    });

    server.post('/api/auth', async (req, res, next) => {
        const { email, password } = req.body;

        try {
            // Authenticate User
            const user = await auth.authenticate(email, password);
            
            // Create token
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
                expiresIn: '120m'
            });

            const { iat, exp } = jwt.decode(token);

            // Respond with token
            res.send({ iat, exp, token });

        } catch (err){
            // Unauthorized
            return next(new errors.UnauthorizedError(err));
        }
    })
};