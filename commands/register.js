const fs = require('fs');
const path = require('path');
const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const { config } = require('../config');
let USERS_ID = require(config.USERS_PATH);

const BOT_BANNED_USERS = config.BOT_BANNED_USERS; //Longoni
const BOT_FILTER_STATE = config.BOT_FILTER;


class RegisterController extends TelegramBaseController{
    handle($){
        const sender_id = $._message._from._id;
        if(BOT_FILTER_STATE){
            if(sender_id !== BOT_BANNED_USERS){
                this.registerHandler($);
            }else{
                $.sendMessage('NotAuthorized: Solo para 6to xd');
            }
        }else{
            this.registerHandler($);
        }
    }
    
    registerHandler($){
        const messageSenderId = $._message._from._id;
        const messageSenderTag = $._message._from._username ? '@' + $._message._from._username : null;

        if(messageSenderTag){
            USERS_ID[messageSenderTag] = messageSenderId
            fs.writeFile(config.USERS_PATH, JSON.stringify(USERS_ID, null, 4), (err) => {
                if(err){
                    console.error(err);
                }
                $.sendMessage(messageSenderTag + ' succesfully registered!');
            })
        }else{
            $.sendMessage('You need to have an @username to register! Set it in your configuration');
        }
    }
}

module.exports = RegisterController;