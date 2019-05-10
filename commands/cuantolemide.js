const Telegram = require('telegram-node-bot'); 
const usageFilter = require('../utils/usageFilter');
const TelegramBaseController = Telegram.TelegramBaseController;


class CuantoLeMideController extends TelegramBaseController{
    before(scope) {
        var scopes = scope._message._text.indexOf(' ');
        var dick_lenght_of_user;

        if(scopes !== -1){
            dick_lenght_of_user = scope._message._text.substring(scopes + 1, scope._message._text.length);
            scope.dick_lenght_of_user = dick_lenght_of_user;
        }

        return scope;
    }

    cuantoLeMideHandlerFilter($){
        usageFilter($, this.cuantoLeMideHandler)
    }

    cuantoLeMideHandler($){
        const dickLength = Math.floor(Math.random() * (25 - 9)) + 9;
        $.sendMessage('Palpando...');
        setTimeout(() => {
            if(dickLength <= 14){
                $.sendMessage('Buscando lupa...');
            }
            setTimeout(() => {
                $.sendMessage(`A ${$.dick_lenght_of_user} le mide ${dickLength}cm` );
            }, 2000)
        }, 2000);
    }

    get routes(){
        return {
            'cuantolemideCommand': 'cuantoLeMideHandlerFilter'
        }
    }
}

module.exports = CuantoLeMideController;