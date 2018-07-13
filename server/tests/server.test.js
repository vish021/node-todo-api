const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todosDummy = [{//seed data just for testing
    text: 'First test todo'
}, {
    text: 'Second test todo'
}];

//testing life cycle method, it runs before every single test case and make sure it's all empty
beforeEach((done) => {
    Todo.remove({}).then(() =>{
        return Todo.insertMany(todosDummy);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            Todo.find().then((allTodos) => {
                expect(allTodos.length).toBe(3);
                expect(allTodos[2].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not create todo with bad data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            Todo.find().then((allTodos) => {
                expect(allTodos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        })
    });
});

describe('GET/ todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});