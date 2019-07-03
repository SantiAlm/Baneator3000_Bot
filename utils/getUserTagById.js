const { config } = require('../config');
let USERS_ID = require(config.USERS_PATH);

function getUserTagById(id){
    let userTag = null;
    Object.entries(USERS_ID).forEach(([key, val]) => { 
        if(val === id){
            userTag = key;
        }
    });
    return userTag;
}

module.exports = getUserTagById;