const Telegram = require('telegram-node-bot');
const TextCommand = Telegram.TextCommand;
const TelegramBot = Telegram.Telegram;

const { config } = require('./config/index');

/* Commands */
const CuantoLeMideController = require('./commands/cuantolemide');
const PornhubLinkControler = require('./commands/ndeah');
const OtherwiseController = require('./commands/otherwise');
const RazonController = require('./commands/quientienerazon');
const VotekickController = require('./commands/votekick');
const PingController = require('./commands/ping');
const RegisterController = require('./commands/register');
const PartyController = require('./commands/partymode');
const ChasquidoController = require('./commands/chasquido');


const TOKEN = config.TOKEN;

const bot = new TelegramBot(TOKEN, {
    workers: 1,
    // webAdmin: {
    //     port: process.env.PORT
    // }
});

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
.when(
    new TextCommand('/partymode', 'partyCommand'),
    new PartyController()
)
.when(
    new TextCommand('/chasquido', 'chasquidoCommand'),
    new ChasquidoController()
)
.otherwise( new OtherwiseController() );
