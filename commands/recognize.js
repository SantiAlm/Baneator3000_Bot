const Telegram = require('telegram-node-bot'); 
const usageFilter = require('../utils/usageFilter');
const TelegramBaseController = Telegram.TelegramBaseController;
const { recognize } = require('../utils/forms/recognize');
const { rekognition } = require('../services/awsLamdaApi');

const { config: { TOKEN } } = require('../config');

class RecognizeController extends TelegramBaseController{
    before(scope) {
        var scopes = scope._message._text.indexOf(' ');
        var dick_lenght_of_user;

        if(scopes !== -1){
            dick_lenght_of_user = scope._message._text.substring(scopes + 1, scope._message._text.length);
            scope.dick_lenght_of_user = dick_lenght_of_user;
        }

        return scope;
    }

    recognizeHandlerFilter($){
        usageFilter($, this.recognizeHandler.bind(this));
    }

    getPhotoLabels($, _filePath){
        const url = `https://api.telegram.org/file/bot${TOKEN}/${_filePath}`
        return rekognition($, url);
    }

    recognizeHandler($){
        $.runForm(recognize, ({ photoId }) => {
            const { _fileId } = photoId[photoId.length - 1];

            $.api.getFile(_fileId).then(({_filePath}) => {
                return this.getPhotoLabels($, _filePath);
            })
            .then((labels) => {
                $.sendMessage(labels);
            })
            .catch((err) => {
                $.sendMessage(err.message);
            });
        });
    }

    get routes(){
        return {
            'recognizeCommand': 'recognizeHandlerFilter'
        }
    }
}

module.exports = RecognizeController;