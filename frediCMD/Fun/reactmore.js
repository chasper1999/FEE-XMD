module.exports = {
    name: 'reactmore',
    aliases: ['morereactions', 'extrareactions'],
    description: 'Show more reaction categories',
    run: async (context) => {
        const { client, m, text, prefix } = context;

        try {
            await client.sendMessage(m.chat, { react: { text: '🎭', key: m.key } });

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

            // Create buttons for additional categories
            const moreButtons = moreCategories.map((category, index) => ({
                buttonId: `${prefix}reactmorecat ${index}`,
                buttonText: { displayText: category.title },
                type: 1
            }));

            // Add back button
            moreButtons.push({
                buttonId: `${prefix}reactions`,
                buttonText: { displayText: "🔙 Main Menu" },
                type: 1
            });

            const message = `🎭 *MORE REACTION CATEGORIES*\n\nSelect a category:`;

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            await client.sendMessage(
                m.chat,
                {
                    text: message,
                    footer: '𝒑𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝒇𝒆𝒆-𝒙𝒎𝒅',
                    buttons: moreButtons,
                    headerType: 1,
                },
                { quoted: m, ad: true }
            );

        } catch (error) {
            console.error('React more error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            await m.reply(`Failed to show more reactions.\nError: ${error.message}`);
        }
    }
};