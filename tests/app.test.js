const expect = require('expect');
const request = require('supertest');

const {app} = require('./../app.js');
const {Todo} = require('./../models/Todo.js');

beforeEach((done)=>{
    Todo.deleteMany({}).then(()=> done());
});

describe("POST /todos", () => {
    it("shouls post a Todo",(done) => {
        var text = "";

        request(app)
         .post('/todos')
         .send({text})
         .expect(400)
         .expect((res)=>{
             expect(res.body.text).toBe(text);
         })
         .end((err,res) => {
            if(err) {
                return done(err);
            }
            Todo.find({}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
         });
    });
});