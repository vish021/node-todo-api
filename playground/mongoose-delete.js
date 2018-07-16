const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);//we do not get document back, would rather get just numbers of deleted records
// });

// Todo.findOneAndRemove({_id: '5b4cf2cbc1a4f3b724980e57'}).then((todo) => {
//     console.log(todo);
// });

// Todo.findByIdAndRemove('5b4cf2cbc1a4f3b724980e57').then((todo) => {
//     console.log(todo);
// });