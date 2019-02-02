const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.authenticate = (email, password) => {
    return new Promise(async(resolve, reject)=> {
        try {
            // Find the user
            const user = await User.findOne({ email });

            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (!isMatch) throw 'Password did not match';
                resolve(user);
            });
        } catch (err) {
            // No match (email||password)
            reject('Authentication Failed.');
        }
    });
};