const axios = require('axios');
const fs = require("fs-extra");
const { exec } = require("child_process");
const child_process = require('child_process');
const { unlink } = require('fs').promises;

// Fonction pour la conversion de GIF en vidéo
const GIFBufferToVideoBuffer = async (image) => {
    const filename = `${Math.random().toString(36)}`;
    await fs.writeFileSync(`./${filename}.gif`, image);
    
    child_process.exec(
        `ffmpeg -i ./${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ./${filename}.mp4`
    );
    
    // Wait for conversion
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const buffer5 = await fs.readFileSync(`./${filename}.mp4`);
    
    // Clean up files
    try {
        await unlink(`./${filename}.mp4`);
        await unlink(`./${filename}.gif`);
    } catch (e) {
        console.log('Cleanup error:', e);
    }
    
    return buffer5;
};

module.exports = {
    name: 'react',
    aliases: ['reactiongif', 'sendreact'],
    description: 'Send anime reaction GIF',
    run: async (context) => {
        const { client, m, text, prefix } = context;

        try {
            if (!text) return m.reply("Usage: *react [reaction_name]*");

            const reactionName = text.trim().toLowerCase();
            
            // Valid reactions mapping
            const validReactions = {
                // Love & Affection
                'hug': { name: 'hug', display: 'Hug', emoji: '🤗' },
                'cuddle': { name: 'cuddle', display: 'Cuddle', emoji: '💕' },
                'kiss': { name: 'kiss', display: 'Kiss', emoji: '😘' },
                'pat': { name: 'pat', display: 'Pat', emoji: '👋' },
                'handhold': { name: 'handhold', display: 'Handhold', emoji: '🤝' },
                
                // Fun & Playful
                'bully': { name: 'bully', display: 'Bully', emoji: '👊' },
                'poke': { name: 'poke', display: 'Poke', emoji: '👉' },
                'tickle': { name: 'tickle', display: 'Tickle', emoji: '😂' },
                'nom': { name: 'nom', display: 'Nom', emoji: '👅' },
                'yeet': { name: 'yeet', display: 'Yeet', emoji: '🚀' },
                
                // Positive Emotions
                'smile': { name: 'smile', display: 'Smile', emoji: '😄' },
                'happy': { name: 'happy', display: 'Happy', emoji: '😊' },
                'blush': { name: 'blush', display: 'Blush', emoji: '😳' },
                'wave': { name: 'wave', display: 'Wave', emoji: '👋' },
                'highfive': { name: 'highfive', display: 'High Five', emoji: '🙌' },
                'wink': { name: 'wink', display: 'Wink', emoji: '😉' },
                'dance': { name: 'dance', display: 'Dance', emoji: '💃' },
                
                // Sad & Dramatic
                'cry': { name: 'cry', display: 'Cry', emoji: '😢' },
                'pout': { name: 'pout', display: 'Pout', emoji: '😤' },
                'sad': { name: 'sad', display: 'Sad', emoji: '😔' },
                'comfort': { name: 'comfort', display: 'Comfort', emoji: '🤗' },
                'cringe': { name: 'cringe', display: 'Cringe', emoji: '😬' },
                
                // Teasing & Attack
                'slap': { name: 'slap', display: 'Slap', emoji: '👋' },
                'kick': { name: 'kick', display: 'Kick', emoji: '🦵' },
                'bonk': { name: 'bonk', display: 'Bonk', emoji: '🔨' },
                'bite': { name: 'bite', display: 'Bite', emoji: '🦷' },
                'glomp': { name: 'glomp', display: 'Glomp', emoji: '🤗' },
                'kill': { name: 'kill', display: 'Kill', emoji: '💀' },
                'lick': { name: 'lick', display: 'Lick', emoji: '👅' },
                
                // Animal Sounds
                'awoo': { name: 'awoo', display: 'Awoo', emoji: '🐺' },
                'neko': { name: 'neko', display: 'Neko', emoji: '🐱' },
                
                // Other
                'smug': { name: 'smug', display: 'Smug', emoji: '😏' },
                'thumbsup': { name: 'thumbsup', display: 'Thumbs Up', emoji: '👍' },
            };

            const reaction = validReactions[reactionName];
            if (!reaction) {
                return m.reply(`Invalid reaction. Available: ${Object.keys(validReactions).join(', ')}`);
            }

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

            // Get reaction GIF from waifu.pics API
            const apiUrl = `https://api.waifu.pics/sfw/${reaction.name}`;
            const response = await axios.get(apiUrl);
            
            if (!response.data || !response.data.url) {
                throw new Error('API returned no GIF');
            }

            const gifUrl = response.data.url;
            
            // Download GIF
            const gifResponse = await axios.get(gifUrl, { responseType: 'arraybuffer' });
            const gifBuffer = Buffer.from(gifResponse.data);

            // Convert GIF to video buffer
            let videoBuffer;
            try {
                videoBuffer = await GIFBufferToVideoBuffer(gifBuffer);
            } catch (conversionError) {
                console.log('GIF conversion failed, sending as GIF:', conversionError);
                // Send as GIF if conversion fails
                await client.sendMessage(m.chat, {
                    video: gifBuffer,
                    gifPlayback: true,
                    caption: `@${m.sender.split('@')[0]} ${reaction.display} ${reaction.emoji} everyone!`,
                    mentions: [m.sender]
                }, { quoted: m });
                return;
            }

            // Prepare caption
            let caption = '';
            let mentions = [m.sender];
            
            if (m.quoted) {
                const quotedSender = m.quoted.sender;
                caption = `@${m.sender.split('@')[0]} ${reaction.display} ${reaction.emoji} @${quotedSender.split('@')[0]}`;
                mentions.push(quotedSender);
            } else {
                caption = `@${m.sender.split('@')[0]} ${reaction.display} ${reaction.emoji} everyone!`;
            }

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            // Send the reaction video
            await client.sendMessage(m.chat, {
                video: videoBuffer,
                gifPlayback: true,
                caption: caption,
                mentions: mentions
            }, { quoted: m });

        } catch (error) {
            console.error('Reaction send error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            
            // Try sending as regular GIF if video conversion fails
            try {
                const simpleUrl = `https://api.waifu.pics/sfw/${text}`;
                const simpleResponse = await axios.get(simpleUrl);
                
                if (simpleResponse.data && simpleResponse.data.url) {
                    await client.sendMessage(m.chat, {
                        image: { url: simpleResponse.data.url },
                        caption: `🎭 *${text.toUpperCase()}* reaction\n🔗 *𝒑𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝒇𝒆𝒆-𝒙𝒎𝒅*`,
                    }, { quoted: m });
                }
            } catch (fallbackError) {
                await m.reply(`Failed to send reaction.\nError: ${error.message}`);
            }
        }
    }
};