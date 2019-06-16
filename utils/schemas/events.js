const joi = require('joi');

const idSchema = joi.number().min(1).max(999);
const typeSchema = joi.string().regex(/^(test|schedule|other|homework)$/);
const dateSchema = joi.string().regex(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))$/i).required();
const descriptionSchema = joi.string().max(40).required();
const confirmationSchema = joi.string().regex(/^(yes|no)$/).required();

module.exports = {
    typeSchema,
    idSchema,
    dateSchema,
    descriptionSchema,
    confirmationSchema
}