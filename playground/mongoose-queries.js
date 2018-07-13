const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


var id = '5b48cdb7c1a4f3b7249809a0';

// if(!ObjectId.isValid(id)) {
//     console.log('ID not valid');
// }

//mongoose converts id into ObjectID instance
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) =>{
//     if(!todo) {
//         console.log('Id not found');
//     }
//     console.log('Todo', todo);
// }).catch((e) => console.log(e));

User.findById(id).then((user) => {
    if(!user) {
        return console.log('User not found');
    }
    console.log('User', user);
}).catch((e) => console.log(e));

