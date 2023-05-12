const { client } = require('../index.js')

const ChannelRequestCreated = client.channels.cache.get('1030751193166786622');
const ChannelRequestAccepted = client.channels.cache.get('1030757802232258590');
const ChannelGameAdd = client.channels.cache.get('1030757929663602728');
const ChannelNewCharacter = client.channels.cache.get('1054398502421143565');
const ChannelNewGear = client.channels.cache.get('1054781119842758727');
const ChannelLottery = client.channels.cache.get('1103289472512184341');

module.exports = { ChannelRequestCreated, ChannelRequestAccepted, ChannelGameAdd, ChannelNewCharacter, ChannelNewGear, ChannelLottery }