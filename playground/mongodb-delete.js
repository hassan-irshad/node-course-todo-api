const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server');

    //deleteMany
    // db.collection('Users').deleteMany({text: 'Hassan'}).then((result) => {
    //     console.log(result);
    // });

    //deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    //findOneAndDelete
    db.collection('Users').findOneAndDelete({_id: new ObjectID('5b8aab7cdc1bdd1b9402e8d2')}).then((result) => {
        console.log(result);
    });

    // db.close();
});