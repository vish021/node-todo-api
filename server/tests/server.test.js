const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
var {User} = require('./../models/user');
const {todosDummy, populateTodos, usersDummy, populateUsers} = require('./seed/seed');

//testing life cycle method, it runs before every single test case and make sure it's all empty
beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todosDummy[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todosDummy[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo was not found', (done) => {
        var hexId = new ObjectId().toHexString();

        request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for invalid ids', (done) => {
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todosDummy[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            Todo.findById(hexId).then((todo) => {
                expect(todo).toBe(null);
                done();
            }).catch((e) => done(e));
        })
    });

    it('should return 404 if not todo was found', (done) => {
        var hexId = new ObjectId().toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if nobject id is not valid', (done) => {
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos:id', () => {
    it('should update the todo', (done) => {
        var hexId = todosDummy[0]._id.toHexString();
        var text = 'This is new test';

        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            completed: true,
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeGreaterThan(0);
        })
        .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todosDummy[1]._id.toHexString();
        var text = 'This is new test';

        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            completed: false,
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBeNull();
        })
        .end(done);
    });
});

describe('GET /users/me', () => {
    it('shouldr eturn user if authenticated', (done) => {
        request(app)
         .get('/users/me')
         .set('x-auth', usersDummy[0].tokens[0].token)
         .expect(200)
         .expect((res) => {
             expect(res.body._id).toBe(usersDummy[0]._id.toHexString());
             expect(res.body.email).toBe(usersDummy[0].email);
         })
         .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
         .get('/users/me')
         .expect(401)
         .expect((res) => {
            expect(res.body).toEqual({});
         })
         .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'abcrere@example.com';
        var password = '123PSD';

        request(app)
         .post('/users')
         .send({email, password})
         .expect(200)
         .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
         })
         .end((err) => {
             if(err) {
                return done(err);
             }

             User.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
             }).catch((e) => done(e));
         });
    });

    it('should return validation error if request is invalid', (done) => {
        var email = 'aaaa';
        var password = '';

        request(app)
         .post('/users')
         .send({email, password})
         .expect(400)
         .end(done);
    });

    it('should not create user if email in use', (done) => {
        request(app)
         .post('/users')
         .send({email: usersDummy[0].email, password: 'abc123'})
         .expect(400)
         .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
         .post('/users/login')
         .send({
             email: usersDummy[1].email,
             password: usersDummy[1].password
         })
         .expect(200)
         .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
         })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(usersDummy[1]._id).then((user) => {
                expect(user.tokens[0]).toMatchObject({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch((e) => done(e));
         });
    });

    it('should reject invalid login', (done) => {
        request(app)
         .post('/users/login')
         .send({
            email: usersDummy[1].email,
            password: 'test'
         })
         .expect(400)
         .expect((res) => {
            expect(res.headers['x-auth']).toBeFalsy();
         })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(usersDummy[1]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e) => done(e));
         });
    });
});