const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const TextCommand = Telegram.TextCommand;
const TelegramBot = Telegram.Telegram;
const chalk = require('chalk');
const axios = require('axios');
const fs = require('fs');

const { config } = require('./config/index');
const pornhub = require('./services/pornhub');

const TOKEN = config.TOKEN;
const BOT_BANNED_USERS = config.BOT_BANNED_USERS; //Longoni
const BOT_FILTER_STATE = config.BOT_FILTER;
const COOLDOWN_PUTEADAS = config.COOLDOWN_PUTEADAS;
const MAXIMUM_AMOUNT_OF_VOTES = config.MAXIMUM_AMOUNT_OF_VOTES;

const UNICODE_TICK = '\u2705';
const UNICODE_CROSS = '\uD83D\uDEAB';
const UNICODE_CLOCK = '\uD83D\uDD52'

var USERS_ID = require('./utils/moks/users_moks.json');
var CURRENT_POLL = { pollId: null, userToBeKickedId: null};
var POLL_VOTES = [];
var POLL_TIMEOUT;

const bot = new TelegramBot(TOKEN, {
    workers: 1,
    // webAdmin: {
    //     port: process.env.PORT
    // }
});

function resetPoll(){
    clearTimeout(POLL_TIMEOUT);
    CURRENT_POLL = { pollId: null, userToBeKickedId: null};
    POLL_VOTES = [];
}

function generatePollStateIcons(){
    var icons = '';

    for(var x = 0 ; x < MAXIMUM_AMOUNT_OF_VOTES ; x++){
        if(POLL_VOTES[x]){
            if(POLL_VOTES[x].vote){
                icons += UNICODE_TICK + ' '
            }else{
                icons += UNICODE_CROSS + ' '
            }
        }else{
            icons += UNICODE_CLOCK + ' '
        }
    }

    return icons;
}

function checkPollState($){
    if(POLL_VOTES.length >= MAXIMUM_AMOUNT_OF_VOTES - 1){
        var positiveVotes = 0;
        var positiveVotesPercentageOfTotal;

        POLL_VOTES.map(({ vote }) => {
            if(vote) positiveVotes++;
        });
        positiveVotesPercentageOfTotal = (positiveVotes*100) / MAXIMUM_AMOUNT_OF_VOTES;
        
        if(positiveVotesPercentageOfTotal >= 80){
            $.sendMessage('Adioooos idiota!', { reply_markup: JSON.stringify({ remove_keyboard: true }) });
            $.kickChatMember(CURRENT_POLL.userToBeKickedId);
            $.unbanChatMember(CURRENT_POLL.userToBeKickedId);
            resetPoll();
        }else{
            if(POLL_VOTES === MAXIMUM_AMOUNT_OF_VOTES){
                $.sendMessage('Votacion rechazada...', { reply_markup: JSON.stringify({ remove_keyboard: true }) });
                resetPoll();
            }
        }
    }
}

function getUserTagById(id){
    var userTag = null;
    Object.entries(USERS_ID).forEach(([key, val]) => { 
        if(val === id){
            userTag = key;
        }
    });
    return userTag;
}

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

function checkIfAlreadyVoted(messageSenderId){
    for(const voteObject of POLL_VOTES){
        if(voteObject.messageSenderId == messageSenderId){
            return true;
        }
    }
    return false;
}

function makeVote($, messageSenderId, vote){
    const messageSenderTag = getUserTagById(messageSenderId);

    if(messageSenderTag){
        POLL_VOTES.push( { messageSenderId,  vote: vote } );
        $.sendMessage(`${messageSenderTag} voted ${vote ? UNICODE_TICK+' F1' : UNICODE_CROSS+' F2'}\nCurrent: ${generatePollStateIcons()}`);
        checkPollState($);
    }
}

class PingController extends TelegramBaseController {
    pingHandlerFilter($){
        usageFilter($, this.pingHandler)
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
                axios.post('https://api.telegram.org/bot796969208:AAH3TEXPD7BGeusWONp1bzljRbwTto2OZ1Y/sendMessage',{
                   chat_id: $._message._chat._id,
                   text: `/votekick ${$.user_ban_tag}\nCurrent: ${generatePollStateIcons()}\nTime left: 60s`,
                   reply_markup: JSON.stringify({ 
                        keyboard: [
                            [UNICODE_TICK+" F1"],
                            [UNICODE_CROSS+" F2"]
                        ],
                        "one_time_keyboard": true 
                    })
                })
                .then(( { data: { result: { message_id } } } ) => {
                    POLL_TIMEOUT = setTimeout(() => {
                        $.sendMessage('Timeout! Cancelling kick poll...', { reply_markup: JSON.stringify({ remove_keyboard: true }) });
                        resetPoll();
                    }, 60000);
                    CURRENT_POLL.pollId = message_id;
                    CURRENT_POLL.userToBeKickedId = USERS_ID[$.user_ban_tag];
               })
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


class RegisterController extends TelegramBaseController{
    handle($){
        usageFilter($, this.registerHandler)
    }
    
    registerHandler($){
        const messageSenderId = $._message._from._id;
        const messageSenderTag = $._message._from._username ? '@' + $._message._from._username : null;

        if(messageSenderTag){
            USERS_ID[messageSenderTag] = messageSenderId
            fs.writeFile('./utils/moks/users_moks.json', JSON.stringify(USERS_ID, null, 4), (err) => {
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
        
        if(CURRENT_POLL.pollId && messageReplyId === CURRENT_POLL.pollId){
            usageFilter($, this.voteHandler)
        }
    }

    voteHandler($){
        const messageSenderId = $._message._from._id;
        const messageText = $._message._text;
    
        if(!checkIfAlreadyVoted(messageSenderId)){
            switch(messageText){
                case UNICODE_TICK + ' F1':
                    makeVote($, messageSenderId, true);
                break;
                
                case UNICODE_CROSS + ' F2': 
                    makeVote($, messageSenderId, false);
                break;
                
                default:
                    $.sendMessage(UNICODE_CROSS+' Invalid Vote!');
                break
            }
        }else{
            $.sendMessage(`${getUserTagById(messageSenderId)} you've already voted!`);
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
.when(
    new TextCommand('/votekick', 'votekickCommand'),
    new VotekickController()
)
.when(
    new TextCommand('/register', 'registerCommand'),
    new RegisterController()
)
.when(
    new TextCommand('/quientienerazon', 'razonCommand'),
    new RazonController()
)
.when(
    new TextCommand('/cuantolemide', 'cuantolemideCommand'),
    new CuantoLeMideController()
)
.otherwise( new OtherwiseController() );