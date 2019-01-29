const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/Todo.js');
const {User} = require('./../../models/User.js');
const jwt = require('jsonwebtoken');

var todos = [{
    _id: new ObjectID(),
    text: "Do coding"
},
{
    text: "Do nodejs",
    _id: new ObjectID()
}];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
var users = [{
    _id: userOneId,
    email: 'user1@gmail.com',
    password: 'userpass1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'},'anc').toString()
    }]
},{
    _id: userTwoId,
    email: 'user2@gmail.com',
    password: 'userpass2'
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