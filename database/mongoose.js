const mongoose = require('mongoose');
mongoose.Promise = global.Promise
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect( process.env.MONGODB_URI ||'mongodb://localhost:27017/TaylorFit');

module.exports = mongoose