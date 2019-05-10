const getUserTagById = require('./getUserTagById');
const { config } = require('../config/index');

const BOT_BANNED_USERS = config.BOT_BANNED_USERS; //Longoni
const BOT_FILTER_STATE = config.BOT_FILTER;


function usageFilter($, callback){
    const sender_id = $._message._from._id;
    if(getUserTagById(sender_id)){
        if(BOT_FILTER_STATE){
            if(sender_id !== BOT_BANNED_USERS){
                callback($);
            }else{
                $.sendMessage('NotAuthorized: Solo para 6to xd');
            }
        }else{
            callback($);
        }
    }else{
        $.sendMessage(`${$._message._from._firstName} you are not registered! To use the bot send /register to do it`);
    }
}

module.exports = usageFilter;