//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5b454759b540556cc90d3d71')
    // }).toArray().then((docs) => {
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fect records', err);
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todo count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fect records', err);
    // });

    db.collection('Users').find({name: 'Vishal'}).count().then((count) => {
        console.log(`Numbe of Vishal's occurance : ${count}`);
    }, (err) => {
        console.log('Unable to fect records', err);
    });

    //db.close();
});