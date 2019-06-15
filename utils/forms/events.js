const joi = require('joi');
const { typeSchema, idSchema, dateSchema, descriptionSchema } = require('../schemas/events');

const addEventForm = {
    type: {
        q: '[1/3]\nWhat type of event is?',
        error: 'ERROR!\nTypes: test, homework, schedule, other',
        validator: (message, callback) => {
            const { error } = joi.validate(message.text, typeSchema)

            if(!error){
                callback(true, message.text);
                return
            }

            callback(false);
        }
    },
    date: {
        q: '[2/3]\nWhen is it (DD/MM)?',
        error: 'ERROR!\nBad format -> DD/MM',
        validator: (message, callback) => {
            const { error } = joi.validate(message.text, dateSchema)

            if(!error){
                callback(true, message.text);
                return
            }

            callback(false);
        }
    },
    description: {
        q: '[3/3]\nGive me a description below:',
        error: 'ERROR!\nMaximum length 40 caracters',
        validator: (message, callback) => {
            const { error } = joi.validate(message.text, descriptionSchema)

            if(!error){
                callback(true, message.text);
                return
            }

            callback(false);
        }
    }
}

module.exports = {
    addEventForm
}