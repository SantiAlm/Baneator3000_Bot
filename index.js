const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const TextCommand = Telegram.TextCommand;
const TelegramBot = Telegram.Telegram;
const ogs = require ('open-graph-scraper');
const firebase = require('firebase');

const { config } = require('./config/index');
const pornhub = require('./services/pornhub');


const TOKEN = config.TOKEN;
const BOT_BANNED_USERS = config.BOT_BANNED_USERS; //Yo
const BOT_FILTER_STATE = config.BOT_FILTER;
const COOLDOWN_PUTEADAS = config.COOLDOWN_PUTEADAS;


const bot = new TelegramBot(TOKEN, {
    workers: 1,
    // webAdmin: {
    //     port: process.env.PORT
    // }
});


function usageFilter($){
    const sender_id = $._message._from._id;
    if(BOT_FILTER_STATE){
        if(sender_id !== BOT_BANNED_USERS){
            return true;
        }else{
            return false;
        }
    }else{
        return true;
    }
}

class PingController extends TelegramBaseController {
    pingHandlerFilter($){
        if(!usageFilter($)){
            $.sendMessage('Vos no xd');
        }else{
            this.pingHandler($);
        }
    }

    pingHandler($) {
        $.sendMessage('pong');
    }

    get routes() {
        return {
            'pingCommand': 'pingHandlerFilter'
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
    
    pornhubLinkHandlerFilter($){
        if(!usageFilter($)){
            $.sendMessage('Vos no xd');
        }else{
            this.pornhubLinkHandler($);
        }
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


class VotekickController extends TelegramBaseController {
    before(scope) {
        var scopes = scope._message._text.indexOf(' ');
        var user_ban_id;

        if(scopes !== -1){
            user_ban_id = scope._message._from._id;
            scope.user_ban_id = user_ban_id;
        }

        return scope;
    }
    
    votekickHandlerFilter($){
        if(!usageFilter($)){
            $.sendMessage('Vos no xd');
        }else{
            this.votekickHandler($);
        }
    }

    votekickHandler($) {
        if($.user_ban_id){
            $.runMenu({
                message: 'Votekick @UnBolude',
                options: {
                     // in options field you can pass some additional data, like parse_mode
                },
                'F1': (data) => {
                    $.sendMessage('Votaste SI', { reply_markup: JSON.stringify({ remove_keyboard:true, selective: true }) });
                },
                'F2': (data) => {
                    $.sendMessage('Votaste NO', { reply_remove: JSON.stringify({ remove_keyboard: true }) });
                },
                'anyMatch': () => {
                    
                }
            });
            // $.sendMessage('Adios idiotaaaa!');
            // $.kickChatMember( $.user_ban_id );
            // $.unbanChatMember( $.user_ban_id );
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


class RegisterController extends TelegramBaseController{
    registerHandler($){
        
    }


    get routes(){
        return {
            'registerCommand': 'registerHandler'
        }
    }
}

class OtherwiseController extends TelegramBaseController{
    // handle($){
    //     if($._message._text.indexOf('ja') !== -1){
    //         $.sendMessage('De que te reis mogolico');
    //     }else if($._message._text.indexOf('js') !== -1){
    //         $.sendMessage('Reite bien idiota');
    //     }
    // }
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
.when(
    new TextCommand('/votekick', 'votekickCommand'),
    new VotekickController()
)
.when(
    new TextCommand('/register', 'registerCommand'),
    new RegisterController()
)
.otherwise( new OtherwiseController() )