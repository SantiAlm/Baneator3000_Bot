const chalk = require('chalk');
const Telegram = require('telegram-node-bot'); 
const TelegramBaseController = Telegram.TelegramBaseController;

const unicodeIcons = require('../utils/unicodeIcons');
const getUserTagById = require('../utils/getUserTagById');
const kickPoll = require('../utils/kickPoll');
const usageFilter = require('../utils/usageFilter');

class OtherwiseController extends TelegramBaseController{
    handle($){
        const messageReplyId = $._message._replyToMessage ? $._message._replyToMessage._messageId : null;
        const messageSenderId = $._message._from._id;
        const messageSenderFirstname = $._message._from._firstName;
        const messageId = $._message._messageId;
        const messageText = $._message._text;

        // console.log(messageReplyId, messageId, messageSenderId, messageSenderFirstname, messageText);

        // console.log(`${chalk.red(messageSenderId)} - ${chalk.green(messageSenderFirstname)}: ${messageText}`); // user_id + firstName + text
        console.log(`Group: ${chalk.yellow($._message._chat._id)} - User: ${chalk.red(messageSenderId)} - Name: ${chalk.green(messageSenderFirstname)}: ${messageText}`); // chat_id + user_id + firstName + text
        
        if(kickPoll.checkIsAVote(messageReplyId)){
            usageFilter($, this.voteHandler);
        }
    }

    voteHandler($){
        const messageSenderId = $._message._from._id;
        const messageText = $._message._text;
    
        if(!kickPoll.checkIfAlreadyVoted(messageSenderId)){
            switch(messageText){
                case unicodeIcons.UNICODE_TICK + ' F1':
                    kickPoll.makeVote($, messageSenderId, true);
                break;
                
                case unicodeIcons.UNICODE_CROSS + ' F2': 
                    kickPoll.makeVote($, messageSenderId, false);
                break;
                
                default:
                    $.sendMessage(unicodeIcons.UNICODE_CROSS+' Invalid Vote!');
                break
            }
        }else{
            $.sendMessage(`${getUserTagById(messageSenderId)} you've already voted!`);
        }
    }
}

module.exports = OtherwiseController;