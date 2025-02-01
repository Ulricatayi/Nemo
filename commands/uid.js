const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'uid',
  description: 'Show user id',
  usage: 'uid',
  author: 'ulric dev',

  async execute(senderId, args, pageAccessToken) {

      
      sendMessage(senderId, senderId, pageAccessToken);
    }
}
