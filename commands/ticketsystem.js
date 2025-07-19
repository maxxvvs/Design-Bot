const fs = require('fs')
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendticketpanel')
        .setDescription('📃 | Sende das Ticket Panel'),

    async execute(interaction) {
        
        if (!interaction.member.roles.cache.has(process.env.ADMINROLEID)) {
            return interaction.reply({ content: '**❌** | Dazu hast du keine Rechte!', ephemeral: true })
        }

        const serverURL = interaction.guild.iconURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
        .setColor(process.env.MAINCOLOR || '#00b2ff')
        .setTitle('Ticket System')
        .setDescription('> Du hast hier die Möglichkeit, ein Ticket zu erstellen, um Support zu erhalten oder eine Bestellung aufzugeben. Darüber hinaus kannst du auch deinen Gewinn von einem gewonnenen Gewinnspiel hier abholen \n\n> Um dir unnötige Wartezeiten zu ersparen, bitten wir dich, dein Anliegen direkt in das Ticket einzutragen. So können wir dir noch schneller und effizienter weiterhelfen')
        .setThumbnail(serverURL)
        .setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&')

        const selectmenu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('select_ticket')
            .setPlaceholder('Klick um alles zu sehen')
            .addOptions(
                {
                    label: 'Kauf Ticket',
                    emoji: '💵',
                    description: 'Wenn du Designs kaufen willst',
                    value: 'buy_ticket'
                },
                {
                    label: 'Support Ticket',
                    emoji: '📨',
                    description: 'Wenn Hilfe oder Fragen hast',
                    value: 'support_ticket'
                },
                {
                    label: 'Giveaway Ticket',
                    emoji: '🎉',
                    description: 'Wenn in einen Gewinnspiel gewonnen hast',
                    value: 'giveaway_ticket'
                },
                {
                    label: 'Partnerschafts Anfrage',
                    emoji: '🤝',
                    description: 'Wenn du mit uns gepartnert sein willst',
                    value: 'partnerschafts_ticket'
                },
                {
                    label: 'Nichts',
                    emoji: '⬛',
                    value: 'nothing_ticket'
                }
            )
        )
        


    interaction.reply({ content: '**✔** | Du hast erfolgreich das Ticket Panel gesendet', ephemeral: true })
    interaction.channel.send({embeds: [embed], components: [selectmenu]})

    }
}