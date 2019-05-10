const Telegram = require('telegram-node-bot');
const path = require('path');
const usageFilter = require('../utils/usageFilter');
const TelegramBaseController = Telegram.TelegramBaseController;

class PartyController extends TelegramBaseController{
    partyHandlerFilter($){
        usageFilter($, this.partyHandler);
    }

    partyHandler($) {
        $.sendPhoto({ path: `${path.join(__dirname, `../images/macri_${Math.floor((Math.random() * 10) + 1)}.jpg`)}`, filename: 'image.jpg'})
    }

    get routes() {
        return {
            'partyCommand': 'partyHandlerFilter'
        }
    }
}

module.exports = PartyController;