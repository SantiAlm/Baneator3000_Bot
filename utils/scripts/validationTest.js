const json = require('../moks/events_moks.json');
const joi = require('joi');
const { addSchema } = require('../schemas/events');

const array = [1];

const { error } = joi.validate(array[1], joi.string().regex(/^(test|schedule|other|homework)$/));

console.log(array[1]);

if(!error){
    console.log('VALIDA3');
}else{
    console.log('NO VALIDA2');
    console.error(error);
}