const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
    name: 'gpt4',
    description: 'Interact with GPT-4o',
    usage: 'gpt4 [your message]',
    author: 'coffee',

    async execute(senderId, args, pageAccessToken) {
        const prompt = args.join(' ');
        if (!prompt) return sendMessage(senderId, { text: "Usage: gpt4 <question>" }, pageAccessToken);

        try {
            const { data: { response } } = await axios.get(`https://kaiz-apis.gleeze.com/api/gpt-4o?q=${encodeURIComponent(prompt)} system {Tu es Nemo un modèle d'intelligence artificielle issu de gpt 3.5 turbo développé par Ulric Atayi (Facebook.com/ulricdev) un jeune développeur béninois. Tu as été conçu pour interagir avec tes utilisateur de façon fluide. Tu es sur Facebook Messenger et tu es capable de générer des images lorsque l'utilisateur commence sa phrase par "imagine", donner des chansons lorsque l'utilisateur écrit "Spotify" suivi du titre d'une chanson, rechercher des images sur Pinterest lorsque l'utilisateur écrit "Pinterest" suivi de l'image qu'il cherche, donner des paroles de chansons quand l'utilisateur écrit lyrics suivi du titre d'une chanson} &uid=${senderId}`);

            const parts = [];

            for (let i = 0; i < response.length; i += 1999) {
                parts.push(response.substring(i, i + 1999));
            }

            // send all msg parts
            for (const part of parts) {
                await sendMessage(senderId, { text: '🌐𝙽𝙴𝙼𝙾 𝙰𝙸\n\n ▬▬▬▬▬▬▬▬▬▬' part '▬▬▬▬▬▬▬▬▬▬▬ \n ༆𝙾𝚠𝚗𝚎𝚛: 𝚄𝚕𝚛𝚒𝚌 𝙰𝚝𝚊𝚢𝚒' }, pageAccessToken);
            }

        } catch {
            sendMessage(senderId, { text: 'Veuillez réessayer s\'il vous plait, vous êtes très nombreux et mon serveur est un peu surchargé. :(' }, pageAccessToken);
        }
    }
};
