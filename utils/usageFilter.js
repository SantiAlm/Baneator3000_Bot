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
    // $.sendMessage(`Estamos en mantenimiento...`);
    // $.sendPhoto({ url: 'https://images.ecosia.org/ePXtFmqDSBuQsh3MkVSJRq9eh1Q=/0x390/smart/https%3A%2F%2Fak5.picdn.net%2Fshutterstock%2Fvideos%2F1006609765%2Fthumb%2F1.jpg', filename: 'image.jpg'})
}

module.exports = usageFilter;