
const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const TextCommand = Telegram.TextCommand;
const TelegramBot = Telegram.Telegram;
const ogs = require ('open-graph-scraper');
// const firebase = require('firebase');

// const config = require('./config/index');
const pornhub = require('./services/pornhub');

const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN, {
    workers: 1
});

class PingController extends TelegramBaseController {
    pingHandler($) {
        $.sendMessage('pong');
    }


    get routes() {
        return {
            'pingCommand': 'pingHandler'
        }
    }
}

class PornhubLinkControler extends TelegramBaseController {
    before(scope) {
        var scopes = scope._message._text.indexOf(' ');

        if(scopes !== -1){
            scopes = scope._message._text.substring(scope._message._text.indexOf(' ')+1 , scope._message._text.length);
            scope.search = scopes;
        }

        return scope;
    }
    
    pornhubLinkHandler($) {
        if($.search){
            $.sendMessage('-No! Coscu no lo hagas!!!\n-No me importa nada frankkaster, ahí lo digo...');
            pornhub($.search).then((url) => {
                $.sendMessage(url);
            });
        }else{
            $.sendMessage('Error!\nUsage -> /ndeah [Search]')
        }
    }

    get routes() {
        return {
            'pornhubCommand': 'pornhubLinkHandler'
        }
    }
}

bot.router
.when(
    new TextCommand('/ping', 'pingCommand'),
    new PingController()
)
.when(
    new TextCommand('/ndeah', 'pornhubCommand'),
    new PornhubLinkControler()
)


