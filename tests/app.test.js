const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../app.js');
const {Todo} = require('./../models/Todo.js');

var todos = [{
        _id: new ObjectID(),
        text: "Do coding"
    },
    {
        text: "Do nodejs",
        _id: new ObjectID()
    }
];

beforeEach((done)=>{
    Todo.deleteMany({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe("POST /todos", () => {
    it("should post a Todo",(done) => {
        var text = "New test todo";
        request(app)
         .post('/todos')
         .send({text})
         .expect(200)
         .expect((res)=>{
             expect(res.body.text).toBe(text);
         })
         .end((err,res) => {
            if(err) {
                return done(err);
            }
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
         });
    });
    it("should not post a Todo with invalid",(done) => {
        var text = "New test todo";
        request(app)
         .post('/todos')
         .send({})
         .expect(400)
         .end((err,res) => {
            if(err) {
                return done(err);
            }
            Todo.find({}).then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
         });
    });
});

describe("GET /todos",() => {
    it("should get a list of all todos",(done) => {
        request(app)
         .get('/todos')
         .expect(200)
         .expect((res) => {
            expect(res.body.todos.length).toBe(2);
         })
         .end(done);
    });
});

describe("GET /todos/:id",() => {
    it("should return a todo",(done) => {
        request(app)
         .get(`/todos/${todos[0]._id.toHexString()}`)
         .expect(200)
         .expect((res) => {
             expect(res.body.todo.text).toBe(todos[0].text);
         })
         .end(done);
    });
    it("should return 400 if UserID not found",(done) => {
        var id = new ObjectID().toHexString();
        request(app)
         .get(`/todos/${id}`)
         .expect(400)
         .expect((res) => {
             expect(res.body.error).toBe("User ID not found");
         })
         .end(done);
    });
    it("should return 404 if ID not valid",(done) => {
        var id = "w76342492r"
        request(app)
         .get(`/todos/${id}`)
         .expect(404)
         .expect((res) => {
             expect(res.body.error).toBe("ID not valid");
         })
         .end(done);
    });
});