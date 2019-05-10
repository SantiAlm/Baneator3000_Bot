const Telegram = require('telegram-node-bot');
const usageFilter = require('../utils/usageFilter');
const TelegramBaseController = Telegram.TelegramBaseController;


class RazonController extends TelegramBaseController{
    before(scope) {
        var scopes = scope._message._text.indexOf(' ');
        var users_to_have_reason;

        if(scopes !== -1){
            users_to_have_reason = scope._message._text.substring(scopes+1, scope._message._text.length);
            users_to_have_reason = users_to_have_reason.split(' ');
            scope.users_to_have_reason = users_to_have_reason;
        }

        return scope;
    }

    razonHandlerFilter($){
        usageFilter($, this.razonHandler)
    }

    razonHandler($){
        $.sendMessage(`Obviamente ${$.users_to_have_reason[Math.floor(Math.random() * (1 - -1))]} tiene razon` );
    }

    get routes(){
        return {
            'razonCommand': 'razonHandlerFilter'
        }
    }
}

module.exports = RazonController;