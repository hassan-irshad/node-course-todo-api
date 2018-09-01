const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server');

    // db.collection('Users').findOneAndUpdate({
    //     _id: new ObjectID('5b8aab6e8a57841c3c2e9b7f')
    // }, {
    //     $set: {
    //         name: 'Hassan'
    //     },
    //     $inc: {
    //         age: 1
    //     }
    // }, {
    //     returnOriginals: false
    // }).then((result) => {
    //     console.log(result);
    // });
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b8aab6e8a57841c3c2e9b7f')
    }, {
        $set: {
            name: 'Andrew'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginals: false
    }).then((result) => {
        console.log(result);
    });
    // db.close();
});