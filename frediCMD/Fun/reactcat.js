const axios = require('axios');

module.exports = {
    name: 'reactcat',
    aliases: ['reactcategory', 'reactions'],
    description: 'Show reactions in selected category',
    run: async (context) => {
        const { client, m, text, prefix } = context;

        try {
            if (!text) return m.reply("Usage: *reactcat [category_number]*");

            const categoryIndex = parseInt(text.trim());

            // Reaction categories
            const reactionCategories = [
                {
                    title: "❤️ LOVE & AFFECTION",
                    reactions: [
                        { name: "hug", emoji: "🤗", display: "Hug 🤗" },
                        { name: "cuddle", emoji: "💕", display: "Cuddle 💕" },
                        { name: "kiss", emoji: "😘", display: "Kiss 😘" },
                        { name: "pat", emoji: "👋", display: "Pat 👋" },
                        { name: "handhold", emoji: "🤝", display: "Handhold 🤝" },
                    ]
                },
                {
                    title: "😂 FUN & PLAYFUL",
                    reactions: [
                        { name: "bully", emoji: "👊", display: "Bully 👊" },
                        { name: "poke", emoji: "👉", display: "Poke 👉" },
                        { name: "tickle", emoji: "😂", display: "Tickle 😂" },
                        { name: "nom", emoji: "👅", display: "Nom 👅" },
                        { name: "yeet", emoji: "🚀", display: "Yeet 🚀" },
                    ]
                },
                {
                    title: "😊 POSITIVE EMOTIONS",
                    reactions: [
                        { name: "smile", emoji: "😄", display: "Smile 😄" },
                        { name: "happy", emoji: "😊", display: "Happy 😊" },
                        { name: "blush", emoji: "😳", display: "Blush 😳" },
                        { name: "wave", emoji: "👋", display: "Wave 👋" },
                        { name: "highfive", emoji: "🙌", display: "High Five 🙌" },
                    ]
                },
                {
                    title: "😭 SAD & DRAMATIC",
                    reactions: [
                        { name: "cry", emoji: "😢", display: "Cry 😢" },
                        { name: "pout", emoji: "😤", display: "Pout 😤" },
                        { name: "sad", emoji: "😔", display: "Sad 😔" },
                        { name: "comfort", emoji: "🤗", display: "Comfort 🤗" },
                        { name: "cringe", emoji: "😬", display: "Cringe 😬" },
                    ]
                },
                {
                    title: "😈 TEASING & ATTACK",
                    reactions: [
                        { name: "slap", emoji: "👋", display: "Slap 👋" },
                        { name: "kick", emoji: "🦵", display: "Kick 🦵" },
                        { name: "bonk", emoji: "🔨", display: "Bonk 🔨" },
                        { name: "bite", emoji: "🦷", display: "Bite 🦷" },
                        { name: "glomp", emoji: "🤗", display: "Glomp 🤗" },
                    ]
                }
            ];

            if (isNaN(categoryIndex) || categoryIndex < 0 || categoryIndex >= reactionCategories.length) {
                return m.reply("Invalid category number.");
            }

            const category = reactionCategories[categoryIndex];

            await client.sendMessage(m.chat, { react: { text: '🎭', key: m.key } });

            // Create buttons for each reaction in the category
            const reactionButtons = category.reactions.map(reaction => ({
                buttonId: `${prefix}react ${reaction.name}`,
                buttonText: { displayText: reaction.display },
                type: 1
            }));

            // Add back button
            reactionButtons.push({
                buttonId: `${prefix}reactions`,
                buttonText: { displayText: "🔙 Back to Categories" },
                type: 1
            });

            const message = `🎭 *${category.title}*\n\nSelect a reaction to send:`;

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            await client.sendMessage(
                m.chat,
                {
                    text: message,
                    footer: '𝒑𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝒇𝒆𝒆-𝒙𝒎𝒅',
                    buttons: reactionButtons,
                    headerType: 1,
                },
                { quoted: m, ad: true }
            );

        } catch (error) {
            console.error('Reaction category error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            await m.reply(`Reaction category failed.\nError: ${error.message}`);
        }
    }
};