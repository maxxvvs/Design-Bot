const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { setFeedbackMessage } = require('../sharedState');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendfeedback')
        .setDescription('📃 | Sende eine Feedback-Panel'),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(process.env.ADMINROLEID)) {
            return interaction.reply({ content: '**`❌`** | Dazu hast du keine Rechte!', ephemeral: true });
        }

        const serverURL = interaction.guild.iconURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
            .setColor(process.env.MAINCOLOR || "#00b2ff")
            .setTitle('Gib uns ein ehrliches Feedback')
            .setDescription('> Hey,\n> Wir würden uns extrem über ein ehrliches Feedback freuen wie du den Support, Design, Kompetenz, etc.... fandest.\n> Wenn du sonst noch irgendwelche Probleme hast, kannst du gerne ein Ticket über <#1393523018705277088> eröffnen und unser Team wird sich bald um dich kümmern :D')
            .setThumbnail(serverURL)
            .setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&');

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('feedback-button')
                    .setLabel('Jetzt Feedback geben')
                    .setEmoji('⭐')
                    .setStyle(ButtonStyle.Primary)
            );

        const feedbackMessage = await interaction.channel.send({ embeds: [embed], components: [button] });
        setFeedbackMessage(feedbackMessage);

        await interaction.reply({ content: '**✔** | Du hast erfolgreich ein Feedback-Panel gesendet', ephemeral: true });
    }
};
