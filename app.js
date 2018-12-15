var express = require('express');
var app = express();
var bodyParser = require('body-parser'); 

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/Todo.js');
var {User} = require('./models/User.js');

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((todo) => {
        res.send(todo);
    },(err) => {
        res.status(400).send(err);
    });
});


app.listen(3000,() => {
    console.log("Server Listening on PORT 3000");
});

module.exports = {app};