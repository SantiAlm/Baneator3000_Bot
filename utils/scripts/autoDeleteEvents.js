const fs = require('fs');
const { config } = require('../../config');

const EVENTS_LIST = require(config.EVENTS_PATH);
const INDEXES_EVENTS = EVENTS_LIST;
const TODAY = new Date();
EVENTS_LIST.forEach((item, index) => {
    if((item.date.day < TODAY.getDate() && item.date.month == TODAY.getMonth()+1) || (item.date.month < TODAY.getMonth()+1) || item.date.year < TODAY.getFullYear()){
        INDEXES_EVENTS.splice(index, 1);
    }
});

fs.writeFile(config.EVENTS_PATH, JSON.stringify(INDEXES_EVENTS, null, 4), (err) => {
    if(err){
        throw err;
    }
});