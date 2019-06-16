/* 
    {
        "id": "",
        "type": "",
        "date": "",
        "description": ""
    }
*/

const fs = require('fs');
const path = require('path')
const joi = require('joi');
const Telegram = require('telegram-node-bot'); 
const usageFilter = require('../utils/usageFilter');
const TelegramBaseController = Telegram.TelegramBaseController;

const { addEventForm, removeEventForm } = require('../utils/forms/events');
const EVENTS_LIST = require('../utils/moks/events_moks.json');
const { typeSchema, idSchema } = require('../utils/schemas/events');

class EventsControler extends TelegramBaseController {
    before(scope) {
        var scopes = scope._message._text.indexOf(' ');
        
        if(scopes !== -1){
            scopes = scope._message._text.substring(scope._message._text.indexOf(' ')+1 , scope._message._text.length);
            scope.options = scopes.split(' ');
        }

        return scope;
    }
    
    eventsHandlerFilter($){
        usageFilter($, this.eventsHandler);
    }

    eventsHandler($) {
        const filterType = (type) => {
            const filteredList = EVENTS_LIST.filter(item => item.type === type);
            let builtString = '';

            if(filteredList.length){
                builtString = filteredList.reduce(( acum, item) => {
                    return acum+`\nId: ${item.id} | Date: ${item.date} | ${item.description}`;
                }, 'List: \n');
            }else{
                builtString = `No ${type} found`;
            }
            
            return builtString;
        }

        const writeEvents = (action) => {
            fs.writeFile(path.resolve(__dirname, '../utils/moks/events_moks.json'), JSON.stringify(EVENTS_LIST, null, 4), (err) => {
                if(err){
                    console.error(err);
                    $.sendMessage('Somethig really bad happened...')
                }
                $.sendMessage(`Succesfully ${action}!`);
            });
        }

        if($.options){
            switch($.options[0]){
                case 'list':
                    const {error: error_list} = joi.validate($.options[1], typeSchema);

                    if(!error_list){
                        $.sendMessage(filterType($.options[1]));
                    }else{
                        $.sendMessage('Usage: \n/events list [test, schedule, homework, other]');
                    }
                break;

                case 'add':
                    $.runForm(addEventForm, (result) => {
                        const randId = Math.floor((Math.random() * 999) + 1);
                        const eventObj = {
                            id: randId,
                            type: result.type,
                            date: result.date + `/${new Date().getFullYear()}`,
                            description: result.description
                        };
                        EVENTS_LIST.push(eventObj);
                        writeEvents('added');
                    });
                break;

                case 'remove':
                    const { error: error_remove} = joi.validate($.options[1], idSchema);
                    
                    if(!error_remove){
                        const eventId = parseInt($.options[1]);
                        const [ eventObj ] = EVENTS_LIST.filter((item) => item.id === eventId);
                        
                        $.runForm(removeEventForm(eventObj), (result) => {
                            if(result.removeConfirmation){
                                for(let [index, item] of EVENTS_LIST.entries()){
                                    if(item.id === eventId){
                                        EVENTS_LIST.splice(index, 1);
                                        console.log(EVENTS_LIST);
                                        writeEvents('removed');
                                        break;
                                    }
                                };
                                
                            }else{
                                $.sendMessage('Canceled!');
                            }
                        })
                    }else{
                        $.sendMessage('Usage: \n/events remove [Id]');
                    }
                break;
            }
        }else{
            $.sendMessage('Error!\nUsage -> /events [Options] [Scope?]');
        }
    }

    get routes() {
        return {
            'eventCommand': 'eventsHandlerFilter'
        }
    }
}

module.exports = EventsControler;