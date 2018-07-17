var mongoose = require('mongoose');

mongoose.Promise = global.Promise;// use global JS promise
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exports = {mongoose};

