const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
const {ObjectID} = require('mongodb');
const _ = require("lodash");

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/Todo.js');
var {User} = require('./models/User.js');
var {authenticate} = require('./middleware/authenticate.js');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


app.post('/todos', (req,res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((todo) => {
        res.send(todo);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req,res) => {
    Todo.find({}).then((todos) => {
        res.send({todos})
    }).catch((err) => {
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
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.delete('/todos/:id', (req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send({error: "ID not valid"});
    }
    Todo.findOneAndDelete({_id:id}).then((todo) => {
        if(!todo) {
            return res.status(400).send({error: "User ID not found"});
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.patch("/todos/:id", (req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body,["text","completed"]);
    if(!ObjectID.isValid(id)) {
        return res.status(404).send({error: "ID not valid"});
    }
    if(_.isBoolean(body.completed) && body.completed==true) {
        body.completedAt = new Date().getTime();
    } else if(_.isBoolean(body.completed) && body.completed==false) {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id},{$set: body},{new:true}).then((todo) => {
        if(!todo) {
            return res.status(400).send({error: "User ID not found"});
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post("/users", (req,res) => {
    var user = new User(_.pick(req.body,['email','password']));

    user.save().then((user) => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get("/users/me",authenticate, (req,res) => {
    res.send(req.user);
});

app.listen(PORT,() => {
    console.log(`Server Listening on PORT ${PORT}`);
});

module.exports = {app};