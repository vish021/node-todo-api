const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const userOneId = new ObjectId();
const userTwoId = new ObjectId();

//seed data just for testing
const todosDummy = [{
    _id: new ObjectId(),
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectId(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator:userTwoId
}];

//seed data just for testing
const usersDummy = [{
    _id: userOneId,
    email: 'andrew@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'andrew21@example.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
    }]
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() =>{
        return Todo.insertMany(todosDummy);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        //for hashing passwords to store in db
        var user1 = new User(usersDummy[0]).save();
        var user2 = new User(usersDummy[1]).save();

        return Promise.all([user1, user2]);
    }).then(() => done());
};

module.exports = {todosDummy, populateTodos, usersDummy, populateUsers};