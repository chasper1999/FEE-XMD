module.exports = {
    name: 'reactmorecat',
    aliases: ['morereactcat'],
    description: 'Show reactions from more categories',
    run: async (context) => {
        const { client, m, text, prefix } = context;

        try {
            if (!text) return m.reply("Usage: *reactmorecat [category_number]*");

            const categoryIndex = parseInt(text.trim());

            // More reaction categories
            const moreCategories = [
                {
                    title: "🐾 ANIMAL REACTIONS",
                    reactions: [
                        { name: "awoo", emoji: "🐺", display: "Awoo 🐺" },
                        { name: "neko", emoji: "🐱", display: "Neko 🐱" },
                        { name: "baka", emoji: "🤪", display: "Baka 🤪" },
                        { name: "wag", emoji: "🐕", display: "Wag Tail 🐕" },
                        { name: "meow", emoji: "😸", display: "Meow 😸" },
                    ]
                },
                {
                    title: "🎮 GAMING REACTIONS",
                    reactions: [
                        { name: "game", emoji: "🎮", display: "Game 🎮" },
                        { name: "win", emoji: "🏆", display: "Win 🏆" },
                        { name: "lose", emoji: "😭", display: "Lose 😭" },
                        { name: "rage", emoji: "😠", display: "Rage 😠" },
                        { name: "gg", emoji: "👍", display: "GG 👍" },
                    ]
                },
                {
                    title: "🎉 PARTY REACTIONS",
                    reactions: [
                        { name: "dance", emoji: "💃", display: "Dance 💃" },
                        { name: "party", emoji: "🎊", display: "Party 🎊" },
                        { name: "celebrate", emoji: "🎉", display: "Celebrate 🎉" },
                        { name: "cheer", emoji: "🥳", display: "Cheer 🥳" },
                        { name: "clap", emoji: "👏", display: "Clap 👏" },
                    ]
                },
                {
                    title: "🛌 SLEEPY REACTIONS",
                    reactions: [
                        { name: "sleep", emoji: "😴", display: "Sleep 😴" },
                        { name: "yawn", emoji: "🥱", display: "Yawn 🥱" },
                        { name: "tired", emoji: "😫", display: "Tired 😫" },
                        { name: "nap", emoji: "💤", display: "Nap 💤" },
                        { name: "snore", emoji: "😪", display: "Snore 😪" },
                    ]
                },
                {
                    title: "🍔 FOOD REACTIONS",
                    reactions: [
                        { name: "nom", emoji: "👅", display: "Nom 👅" },
                        { name: "yum", emoji: "😋", display: "Yum 😋" },
                        { name: "hungry", emoji: "🍕", display: "Hungry 🍕" },
                        { name: "eat", emoji: "🍽️", display: "Eat 🍽️" },
                        { name: "drink", emoji: "🥤", display: "Drink 🥤" },
                    ]
                }
            ];

            if (isNaN(categoryIndex) || categoryIndex < 0 || categoryIndex >= moreCategories.length) {
                return m.reply("Invalid category number.");
            }

            const category = moreCategories[categoryIndex];

            await client.sendMessage(m.chat, { react: { text: '🎭', key: m.key } });

            // Create buttons for each reaction in the category
            const reactionButtons = category.reactions.map(reaction => ({
                buttonId: `${prefix}react ${reaction.name}`,
                buttonText: { displayText: reaction.display },
                type: 1
            }));

            // Add navigation buttons
            reactionButtons.push({
                buttonId: `${prefix}reactmore`,
                buttonText: { displayText: "🔙 Back to More" },
                type: 1
            });

            reactionButtons.push({
                buttonId: `${prefix}reactions`,
                buttonText: { displayText: "🏠 Main Menu" },
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
            console.error('More categories error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            await m.reply(`Failed to show category reactions.\nError: ${error.message}`);
        }
    }
};