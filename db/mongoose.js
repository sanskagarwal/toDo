var mongoose = require('mongoose');
var URI = 'mongodb://skbro:sk1234@ds123136.mlab.com:23136/todo-app'; // For Development and Production
var URI2 = "mongodb://localhost:27017/todo-app"; // For Testing
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(URI);

module.exports = {mongoose};