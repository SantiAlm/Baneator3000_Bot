const Pornhub = require('../lib/pornhub-api/src/index')
const Videos = new Pornhub.Videos();
 
const getVideoUrl = (search) => { return Videos.searchVideos({
    search: search
}).then(videos => {
    return videos.videos[Math.floor(Math.random() * (10 - 1)) + 1].url;
})}



module.exports = getVideoUrl;