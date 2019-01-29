const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
const {ObjectID} = require('mongodb');
const _ = require("lodash");
const bcrypt = require("bcryptjs");

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/Todo.js');
var {User} = require('./models/User.js');
var {authenticate} = require('./middleware/authenticate.js');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


app.post('/todos',authenticate, (req,res) => {
    var todo = new Todo({
        text: req.body.text,
        owner_id: req.user._id
    });

    todo.save().then((todo) => {
        res.send(todo);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', authenticate, (req,res) => {
    Todo.find({owner_id: req.user._id}).then((todos) => {
        res.send({todos})
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', authenticate, (req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send({error: "ID not valid"});
    }

    Todo.findOne({_id: id, owner_id: req.user._id}).then((todo) => {
        if(!todo) {
            return res.status(400).send({error: "User ID not found"});
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.delete('/todos/:id', authenticate,  (req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send({error: "ID not valid"});
    }
    Todo.findOneAndDelete({_id:id, owner_id: req.user._id}).then((todo) => {
        if(!todo) {
            return res.status(400).send({error: "User ID not found"});
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.patch("/todos/:id",authenticate, (req,res) => {
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

    Todo.findOneAndUpdate({_id: id, owner_id: req.user._id},{$set: body},{new:true}).then((todo) => {
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

app.post("/users/login", (req,res) => {
    var body = _.pick(req.body,['email','password']);
    User.findOne({email: body.email}).then((user) => {
        if(!user) {
            return res.status(400).send();
        }
        bcrypt.compare(body.password,user.password,(err,result) => {
            if(result==true) {
                user.generateAuthToken().then((token) => {
                    res.header('x-auth', token).send(user);
                }).catch((e) => {
                    res.status(400).send(e);
                });
            } else {
                res.status(400).send();
            }
        });
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
});

app.delete("/users/me/token", authenticate, (req,res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch(() => {
        res.status(400).send();
    });
});

app.listen(PORT,() => {
    console.log(`Server Listening on PORT ${PORT}`);
});

module.exports = {app};