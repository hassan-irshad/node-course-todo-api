const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/users');

var id = '5b8af1cae2201c081742cc11';

// var id = '5b8cfe4992ca404c330e6adf11';

// if (!ObjectID.isValid(id)) {
//     console.log('ID is not valid');
// }

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

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('ID not found');
//     }
//     console.log('Todo by ID', todo);
// }).catch((e) => console.log(e));

User.findById(id).then((user) => {
    if(!user) {
        return console.log('ID not Found');
    }
    console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
