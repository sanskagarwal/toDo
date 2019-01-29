const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/Todo.js');
const {User} = require('./../../models/User.js');
const jwt = require('jsonwebtoken');
var JWT_SECRET = require("./../../config.json")['JWT_SECRET'] || process.env.JWT_SECRET;

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
var users = [{
    _id: userOneId,
    email: 'user1@gmail.com',
    password: 'userpass1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, JWT_SECRET).toString()
    }]
},{
    _id: userTwoId,
    email: 'user2@gmail.com',
    password: 'userpass2',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, JWT_SECRET).toString()
    }]
}];

var todos = [{
    _id: new ObjectID(),
    text: "Do coding",
    owner_id: userOneId
},
{
    text: "Do nodejs",
    _id: new ObjectID(),
    owner_id: userTwoId
}];

const populateTodos = (done) => {
    Todo.deleteMany({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        var user1 = new User(users[0]);
        user1.save().catch((err) => {
            console.log(err);
        });
        var user2 = new User(users[1]);
        user2.save().catch((err) => {
            console.log(err);
        });
    }).then(() => done());
};

module.exports = {todos,populateTodos,users,populateUsers};