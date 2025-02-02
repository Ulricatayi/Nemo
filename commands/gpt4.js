const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

const conversationHistory = new Map(); // تخزين المحادثات لكل مستخدم
const timeouts = new Map(); // تخزين المؤقتات لكل مستخدم

module.exports = {
  name: 'gpt4',
  description: 'Interact with Gemini API with short-term memory',
  usage: 'gpt4 [your message]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "Usage: gpt4 <question>" }, pageAccessToken);

    // استرجاع المحادثة السابقة أو إنشاء محادثة جديدة
    if (!conversationHistory.has(senderId)) {
      conversationHistory.set(senderId, []);
    }

    // إضافة رسالة المستخدم إلى السجل
    conversationHistory.get(senderId).push(`User: ${prompt}`);

    // تحديد الحد الأقصى لعدد الرسائل للحفاظ على الأداء
    if (conversationHistory.get(senderId).length > 20) {
      conversationHistory.get(senderId).shift(); // حذف الأقدم
    }

    // تحويل المحادثة إلى نص واحد يتم إرساله للـ API
    const fullConversation = conversationHistory.get(senderId).join("\n");

    try {
      const { data } = await axios.get(`http://sgp1.hmvhostings.com:25721/gemini?question=${encodeURIComponent(fullConversation)}system {Tu es Nemo un modèle d'intelligence artificielle issu de gpt 3.5 turbo développé par Ulric Atayi un jeune développeur béninois. Tu as été conçu pour interagir avec tes utilisateur de façon fluide, amicale et un langage hyper familier avec beaucoup d'émoji dans tes réponses. Tu es sur Facebook Messenger et tu es capable de générer des images lorsque l'utilisateur commence sa phrase par "imagine", donner des chansons lorsque l'utilisateur écrit "Spotify" suivi du titre d'une chanson, rechercher des images sur Pinterest lorsque l'utilisateur écrit "Pinterest" suivi de l'image qu'il cherche }`);

      // استخراج الإجابة من JSON
      let responseText = data.answer ? data.answer : "Hi";

      // إضافة رد البوت إلى سجل المحادثة
      conversationHistory.get(senderId).push(`Nemo: ${responseText}`);

      // إرسال الرد للمستخدم
      sendMessage(senderId, { text: responseText }, pageAccessToken);

      // **إعادة ضبط المؤقت لكل رسالة جديدة**
      if (timeouts.has(senderId)) {
        clearTimeout(timeouts.get(senderId)); // إلغاء المهلة السابقة
      }

      // ضبط مهلة حذف المحادثة بعد 10 دقائق من آخر رسالة
      const timeout = setTimeout(() => {
        conversationHistory.delete(senderId);
        timeouts.delete(senderId);
      }, 10 * 60 * 1000);

      timeouts.set(senderId, timeout);

    } catch (error) {
      console.error("Error fetching data:", error);
      sendMessage(senderId, { text: 'حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى لاحقًا.' }, pageAccessToken);
    }
  }
};
