const Telegram = require('telegram-node-bot');
const path = require('path');
const usageFilter = require('../utils/usageFilter');
const TelegramBaseController = Telegram.TelegramBaseController;
const { config } = require('../config');
const USERS_ID = require(config.USERS_PATH);

class ChasquidoController extends TelegramBaseController{
    chasquidoHandlerFilter($){
        usageFilter($, this.chasquidoHandler);
    }

    chasquidoHandler($) {
        if($._message._from._id == 587473004){
            const usersArray = Object.entries(USERS_ID).sort();
            const rand = Math.floor((Math.random() * usersArray.length));
            $.sendPhoto({ path: `${path.join(__dirname, `../images/thanos_chasquido.jpg`)}`, filename: 'image.jpg'});
            setTimeout(() => {
                $.kickChatMember(usersArray[rand][1]);
                $.unbanChatMember(usersArray[rand][1]);
            }, 1000);
        }
    }

    get routes() {
        return {
            'chasquidoCommand': 'chasquidoHandlerFilter'
        }
    }
}

module.exports = ChasquidoController;