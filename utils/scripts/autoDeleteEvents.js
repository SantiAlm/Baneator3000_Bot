const path = require('path');
const fs = require('fs');

const EVENTS_LIST = require('../moks/events_moks.json');
const INDEXES_EVENTS = EVENTS_LIST;
const TODAY = new Date();
EVENTS_LIST.forEach((item, index) => {
    if((item.date.day < TODAY.getDate() && item.date.month == TODAY.getMonth()+1) || item.date.month < TODAY.getMonth() || item.date.year < TODAY.getFullYear()){
        INDEXES_EVENTS.splice(index);
    }
});

fs.writeFile(path.resolve(__dirname, '../moks/events_moks.json'), JSON.stringify(INDEXES_EVENTS, null, 4), (err) => {
    if(err){
        throw err;
    }
});