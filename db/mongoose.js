var mongoose = require('mongoose');
var URI = 'mongodb://skbro:sk1234@ds123136.mlab.com:23136/todo-app';
mongoose.Promise = global.Promise;
mongoose.connect(URI, {useNewUrlParser: true});

module.exports = {mongoose};