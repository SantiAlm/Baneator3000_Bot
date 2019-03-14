require('dotenv').config()

const firebase_config = {
    "apiKey": "AIzaSyBeXELXlEdojbQejKxHvLVpWlpFR6RPCkw",
    "authDomain": "baneator3000-bot.firebaseapp.com",
    "databaseURL": "https://baneator3000-bot.firebaseio.com",
    "projectId": "baneator3000-bot",
    "storageBucket": "baneator3000-bot.appspot.com",
    "messagingSenderId": "1072970565539"
}


const config = {
    "TOKEN": process.env.TOKEN,
    "BOT_FILTER": process.env.BOT_FILTER === 'true',
    "BOT_BANNED_USERS": parseInt(process.env.BOT_BANNED_USERS)
}

module.exports =  {config, firebase_config};