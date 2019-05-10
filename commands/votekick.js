const axios = require('axios');
const Telegram = require('telegram-node-bot');
const usageFilter = require('../utils/usageFilter');
const TelegramBaseController = Telegram.TelegramBaseController;
const { config } = require('../config/index');

const kickPoll = require('../utils/kickPoll');
const unicodeIcons = require('../utils/unicodeIcons');
let USERS_ID = require('../utils/moks/users_moks.json');

class VotekickController extends TelegramBaseController {
    before(scope) {
        var scopes_init = scope._message._text.indexOf(' ') +1 ;
        var user_ban_tag;

        if(scopes_init > 0){
            user_ban_tag = scope._message._text.substring(scopes_init, scope._message._text.length);
            scope.user_ban_tag = user_ban_tag;
        }

        return scope;
    }
    
    votekickHandlerFilter($){
        usageFilter($, this.votekickHandler)
    }

    votekickHandler($) {
        if($.user_ban_tag){
            if(USERS_ID[$.user_ban_tag]){
                axios.post(`https://api.telegram.org/bot${config.TOKEN}/sendMessage`,{
                   chat_id: $._message._chat._id,
                   text: `/votekick ${$.user_ban_tag}\nCurrent: ${kickPoll.generatePollStateIcons()}\nTime left: 60s`,
                   reply_markup: JSON.stringify({
                        keyboard: [
                            [unicodeIcons.UNICODE_TICK+" F1"],
                            [unicodeIcons.UNICODE_CROSS+" F2"]
                        ],
                        "one_time_keyboard": true 
                    })
                })
                .then(( { data: { result: { message_id } } } ) => {
                    const pollTimeOutId = setTimeout(() => {
                        $.sendMessage('Timeout! Cancelling kick poll...', { reply_markup: JSON.stringify({ remove_keyboard: true }) });
                        kickPoll.resetPoll();
                    }, 80000);
                    kickPoll.setUpPoll(message_id, USERS_ID[$.user_ban_tag], pollTimeOutId);
                });
            }else{
                $.sendMessage($.user_ban_tag+' is not registered!');
            }
        }else{
            $.sendMessage('Error!\nUsage -> /votekick [Victima]');
        }
    }

    get routes() {
        return {
            'votekickCommand': 'votekickHandlerFilter'
        }
    }
}

module.exports = VotekickController;