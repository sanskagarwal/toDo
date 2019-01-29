var mongoose = require('mongoose');
var URI=require("./../config.json")['MONGO_TEST'] || process.env.MONGOLAB_URI;
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(URI);

module.exports = {mongoose};