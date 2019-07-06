const axios = require('axios');
const { config: { AWS_API_STAGE, AWS_API_URL } } = require('../config');

module.exports = {
    rekognition: ($, url) => axios.get(`${AWS_API_URL}/${AWS_API_STAGE}?img=${url}`).then(({ data: { data , error, message } }) => {
        if(error){
            throw new Error(message);
        }
        const { Labels: rekognition } = data;
        const labels = rekognition.reduce((final, item, index) => {
            return final + `${index + 1}- ${item.Name}\n`
        }, 'This photo has: \n');
    
        return labels;
    })
}



