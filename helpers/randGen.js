const { nextTick } = require("async");

// Generate Case Number
// module.exports = {
//     randomString: (length, chars, next) => {
//         // (next) => {
//         var mask = '';
//         if (chars.indexOf('#') > -1) mask += '0123456789';
//         if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//         var result = '';
//         for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
//         console.log(result);
//         next(result);
//     // }
//     }
// };
function randomString(length, chars, next) {
    var mask = '';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    next();
}

module.exports = randomString;
