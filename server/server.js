require('./config/config');

const {ObjectId} = require('mongodb');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');//take your json and convert it into an object

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
var app = express();

app.use(bodyParser.json());//middleware bodyParser.json() return function

app.post('/todos', authenticate, async (req, res) => {
    try {
        var todo = new Todo({
            text: req.body.text,
            _creator: req.user._id
        });

        const doc = await todo.save();
        res.send(doc);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get('/todos', authenticate, async (req, res) => {
    try {
        const todos = await Todo.find({ _creator: req.user._id});
        res.send({todos});
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get('/todos/:id', authenticate, async (req, res) => {
    try {
        var id = req.params.id;
        if(!ObjectId.isValid(id)) {
            return res.status(404).send();
        }

        const todo = await Todo.findOne({_id: id, _creator: req.user._id});
        if(!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    } catch (e) {
        res.status(400).send();
    }
});

app.delete('/todos/:id', authenticate, async (req, res) => {
    try {
        var id = req.params.id;
        if(!ObjectId.isValid(id)) {
            return res.status(404).send();
        }

        const todo =  await Todo.findOneAndRemove({_id: id, _creator: req.user._id});
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    } catch (e) {
        res.status(400).send();
    }
});

app.patch('/todos/:id', authenticate, async (req, res) => {
    try {
        var id = req.params.id;
        var body = _.pick(req.body, ['text', 'completed']);//we don't want users to update anything they choose

        if(!ObjectId.isValid(id)) {
            return res.status(404).send();
        }

        if(_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        const todo = await Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true});
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    } catch (e) {
        res.status(400).send();
    }

});

//this route should be public so that user would signup and get back the token
app.post('/users', async (req, res) => {
    try {
        var user = new User(_.pick(req.body, ['email', 'password']));
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);//x- is meant for custom header
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Started on port ${process.env.PORT}`);
});

module.exports = {app};