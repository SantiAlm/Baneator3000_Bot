const joi = require('joi');
const { photoArray } = require('../schemas/recognize');

const recognize = {
    photoId: {
        q: 'Now give me a photo to examine',
        error: 'Thats not a photo!',
        validator: (message, callback) => {
            const { error } = joi.validate(message._photo, photoArray);
            
            if(!error){
                callback(true, message._photo);
                return;
            }

            callback(false);
        }
    }
}

module.exports = {
    recognize
}