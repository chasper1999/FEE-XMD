const axios = require('axios');
const { getSettings } = require('../../Database/config');

// Fonction pour la conversion de GIF en vidéo
const GIFBufferToVideoBuffer = async (image) => {
    const fs = require("fs-extra");
    const child_process = require('child_process');
    const { unlink } = require('fs').promises;

    const sleep = (ms) => {
        return new Promise((resolve) => { setTimeout(resolve, ms); });
    };

    const filename = `${Math.random().toString(36)}`;
    await fs.writeFileSync(`./${filename}.gif`, image);

    child_process.exec(
        `ffmpeg -i ./${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ./${filename}.mp4`
    );

    await sleep(4000);
    const buffer5 = await fs.readFileSync(`./${filename}.mp4`);

    Promise.all([
        unlink(`./${filename}.mp4`),
        unlink(`./${filename}.gif`)
    ]).catch(() => {});

    return buffer5;
};

module.exports = {
    name: 'reactions',
    aliases: ['react', 'emoji', 'express'],
    description: 'Send anime reaction GIFs with buttons interface',
    run: async (context) => {
        const { client, m, text, prefix } = context;
        const settings = await getSettings();
        const botPrefix = settings.prefix || prefix;

        try {
            // Send initial reaction
            await client.sendMessage(m.chat, { react: { text: '🎭', key: m.key } });

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

            // Create buttons for each category
            const allButtons = [];
            reactionCategories.forEach((category, index) => {
                allButtons.push({
                    buttonId: `${botPrefix}reactcat ${index}`,
                    buttonText: { displayText: category.title },
                    type: 1
                });
            });

            // Add more reactions button
            allButtons.push({
                buttonId: `${botPrefix}reactmore`,
                buttonText: { displayText: "📋 More Reactions" },
                type: 1
            });

            const message = `🎭 *ANIME REACTIONS* 🎭\n\nSend anime reaction GIFs to express yourself!\n\n*Reply to a message* to target someone, or send alone for everyone.\n\n*Select a category:*`;

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            await client.sendMessage(
                m.chat,
                {
                    text: message,
                    footer: '𝒑𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝒇𝒆𝒆-𝒙𝒎𝒅',
                    buttons: allButtons,
                    headerType: 1,
                },
                { quoted: m, ad: true }
            );

        } catch (error) {
            console.error('Reaction command error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            await m.reply(`Reaction command failed.\nError: ${error.message}`);
        }
    }
};