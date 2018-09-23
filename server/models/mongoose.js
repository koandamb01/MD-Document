const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// connect to the mongodb
mongoose.connect('mongodb://localhost/products');
const db = mongoose.connection;
db.on('error', (error) => {
    console.log("error during connection: ", error);
});

db.on('open', () => {
    console.log("mongoose is now connected!");
});
module.exports = mongoose;