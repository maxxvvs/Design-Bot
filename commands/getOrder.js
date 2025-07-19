const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const orderManager = require('../orderManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getorderlist')
        .setDescription('ℹ | bekomme information über eine orderliste')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('wähle ein use aus')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(process.env.ADMINROLEID)) {
            return interaction.reply({ content: '**`❌`** | Dazu hast du keine Berechtigung', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const orders = orderManager.getAllOrders();

        const orderIndex = orders.findIndex(order => order.userid === user.id);
        if (orderIndex === -1) {
            return interaction.reply({ content: '**`❌`** | <@' + user.id + '> ist nicht in der Warteliste!', ephemeral: true });
        }

        const order = orders[orderIndex];
        const placement = orderIndex + 1;

        const memberavatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });
        const orderTimestamp = Math.floor(new Date(order.timestamp).getTime() / 1000);
        const formattedDate = `<t:${orderTimestamp}:F>`;
        const relativeTime = `<t:${orderTimestamp}:R>`;

        const embed = new EmbedBuilder()
            .setTitle(`Daten geladen von Platzierung: ${placement}`)
            .setColor(process.env.MAINCOLOR || '#00b2ff')
            .addFields(
                { name: '👤 **User**', value: '<@' + user.id + '>\n`ID:' + user.id + '`', inline: true },
                { name: '📅 **Warteliste seit**', value: `${formattedDate} \n(${relativeTime})`, inline: true },
                { name: '🛒 **Channel**', value: '<#' + order.channelId + '>\n`ID: ' + order.channelId + '`', inline: false },
                { name: '📃 **Gekauft**', value: `${order.order}`, inline: false }
            )
            .setThumbnail(memberavatarURL)
            
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
