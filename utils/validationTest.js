const json = require('./moks/events_moks.json');
const joi = require('joi');
const { addSchema } = require('./schemas/events');

const { error } = joi.validate(json[1], addSchema);

if(!error){
    console.log('VALIDA3');
}else{
    console.log('NO VALIDA2');
    console.error(error);
}