const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';


// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });

// }); //bigger the number, longer it takes

var hashPassword = '$2a$10$gxDLdtmRgyYaD3jgFmycxOUMm2tPt9CfbzI6VN0VUwHP1QR.4w2Pa';

bcrypt.compare(password, hashPassword, (err, result)  => {
    console.log(result);
});
// var data = {
//     id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);

// var message =  'I  am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'SOME_SALT').toString()
// }

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHAsh = SHA256(JSON.stringify(token.data) + 'SOME_SALT').toString();
// if(resultHAsh === token.hash){
//     console.log('data was not changed');
// } else {
//     console.log('data was changed');
// }