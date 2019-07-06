const Telegram = require('telegram-node-bot'); 
const usageFilter = require('../utils/usageFilter');
const TelegramBaseController = Telegram.TelegramBaseController;
const { recognize } = require('../utils/forms/recognize');
const axios = require('axios');
const { config } = require('../config');

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
        // usageFilter($, this.recognizeHandler);
        this.recognizeHandler($)
    }

    getPhotoFile($, _filePath){
        const url = `https://api.telegram.org/file/bot${config.TOKEN}/${_filePath}`
        
        axios.get(`${config.AWS_API_URL}/test?img=${url}`).then(({ data: { data: { Labels: data } } }) => {
            const labels = data.reduce((final, item, index) => {
                return final + `${index + 1}- ${item.Name}\n`
            }, 'This photo has: \n');

            $.sendMessage(labels);
        });
    }

    recognizeHandler($){
        $.runForm(recognize, ({ photoId }) => {
            const { _fileId } = photoId[photoId.length - 1];

            $.api.getFile(_fileId).then(({_filePath}) => {
                this.getPhotoFile($, _filePath);
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