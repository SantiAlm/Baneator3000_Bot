const joi = require('joi');

const photoArray = joi.array().required();

module.exports = {
    photoArray
}