const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server');

    // db.collection('Todos').find(
    //    {_id: new ObjectID('5b8ab15b2d9882f9f3d20323')}
    // ).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos');
    // });

    // db.collection('Todos').find().count().then((count) => {
    //      console.log(`Todos count: ${count}`);
    //  }, (err) => {
    //      console.log('Unable to fetch todos');
    //  });
    db.collection('Users').find({name: 'Hassan Irshad'}).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        if (err) {
            console.log('Unable to fetch todo');
        }
    });

    // db.close();
});