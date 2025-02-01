const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ulric',
  description: 'Interact with Nemo owner (Ulric Atayi)',
  usage: 'feedback [your message]',
  author: 'Ulric Atayi',
  async execute(senderId, args, pageAccessToken) {
    const ID = '28609546861992767';  //ADD YOUR ID HERE
    const prompt = args.join(' ');

    if (!prompt) return sendMessage(senderId, {
       text: "❌Invalid usage \n 💬Usage: feedback <Votre message>" 
      }, pageAccessToken);

    else sendMessage(senderId, {
      text: "📨📨Message envoyé📨📨 \n\n\n Destinataire: Ulric Atayi \n\n\nFacebook: facebook.com/ulricdev \n\nUlric vous recontactera bientôt en privé." 
    }, pageAccessToken)
    sendMessage( `${ID}` , { text: 'Nouveau message n\n\ `${prompt}` From n\n\ `${senderId}` }' , pageAccessToken)
  }

}
