const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'Hassan123';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashPassword = '$2a$10$2vJg9c7zpuK/AjDEEzTsYOQFTKrCNwspDTrpKhkyVWl2GU7VIiaRO';

bcrypt.compare(password, hashPassword, (err, res) => {
    console.log(res);
});





// var data = {
//     id: 10
// };

// var token = jwt.sign(data, 'abc123');
// console.log(token);

// var decoded= jwt.verify(token, 'abc123');
// console.log('Decoded', decoded);


// var message = 'I am user number 2';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);

// console.log(`Hash: ${hash}`);


// var data = {
//     id: 3
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };


// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//     console.log('Data was not changed.')
// } else {
//     console.log('Data was changed, do not trust.');
// }