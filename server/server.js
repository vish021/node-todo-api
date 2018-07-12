var express = require('express');
var bodyParser = require('body-parser');//take your json and convert it into an object

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
app.use(bodyParser.json());//middleware bodyParser.json() return function

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    }); 
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};