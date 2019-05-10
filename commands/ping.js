const Telegram = require('telegram-node-bot');
const usageFilter = require('../utils/usageFilter');
const TelegramBaseController = Telegram.TelegramBaseController;

class PingController extends TelegramBaseController{
    pingHandlerFilter($){
        usageFilter($, this.pingHandler);
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

module.exports = PingController;