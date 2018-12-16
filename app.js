var express = require('express');
var app = express();
var bodyParser = require('body-parser'); 
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/Todo.js');
var {User} = require('./models/User.js');
const PORT = process.env.PORT || 3000;

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

app.get('/todos', (req,res) => {
    Todo.find({}).then((todos) => {
        res.send({todos})
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send({error: "ID not valid"});
    }
    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(400).send({error: "User ID not found"});
        }
        res.send({todo});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.listen(PORT,() => {
    console.log(`Server Listening on PORT ${PORT}`);
});

module.exports = {app};