const pornhub = require('../services/pornhub');
const Telegram = require('telegram-node-bot'); 
const usageFilter = require('../utils/usageFilter');
const TelegramBaseController = Telegram.TelegramBaseController;

class PornhubLinkControler extends TelegramBaseController {
    before(scope) {
        var scopes = scope._message._text.indexOf(' ');

        if(scopes !== -1){
            scopes = scope._message._text.substring(scope._message._text.indexOf(' ')+1 , scope._message._text.length);
            scope.search = scopes;
        }

        return scope;
    }
    
    pornhubLinkHandlerFilter($){
        usageFilter($, this.pornhubLinkHandler)
    }

    pornhubLinkHandler($) {
        if($.search){
            $.sendMessage('Buscando...');
            pornhub($.search).then((url) => {
                $.sendMessage(url);
            }).catch((err) => {
                $.sendMessage('No se encontraron resultados... Raro de mierda');
            });
        }else{
            $.sendMessage('Error!\nUsage -> /ndeah [Search]')
        }
    }

    get routes() {
        return {
            'pornhubCommand': 'pornhubLinkHandlerFilter'
        }
    }
}

module.exports = PornhubLinkControler;