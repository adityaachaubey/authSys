
'use strict';
const bcrypt = require('bcrypt-nodejs');
const multer = require('multer');


//user defined libraries
let Auth = require('../../Auth/auth.service');



//only exports
module.exports.generateHash = function (password) {
    return bcrypt.hashSync(password);
};

module.exports.uploadZip = function () {
    return upload
};
