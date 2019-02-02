const restify = require('restify');
const mongoose = require('mongoose');
const rjwt = require('restify-jwt-community')
const config =  require('./config');

const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

// Start the server listening on PORT
server.listen(config.PORT, () => {
    mongoose.set('useFindAndModify', false);
    mongoose.connect(
        config.MONGODB_URI,
        { useNewUrlParser: true }
    );
});

// Connect to the MongoDB db
const db = mongoose.connection;

db.on('error', err => console.log(err));

db.once('open', () => {
    require('./routes/posts')(server);
    require('./routes/users')(server);
    console.log(`Server started on port ${config.PORT}`);
});