const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const orderManager = require('../orderManager');

let orderPanelMessage = null;

const createOrderPanel = () => {
    const embed = new EmbedBuilder()
        .setTitle('Warteliste')
        .setColor(process.env.MAINCOLOR || '#00b2ff');

    const orders = orderManager.getAllOrders();

    if (orders.length === 0) {
        embed.setDescription('```Keiner ist auf der Warteliste zurzeit```');
    } else {
        const description = orders.map((order, index) => `**${index + 1}.** <@${order.userid}> | **Bestellt**: ${order.order}`).join('\n');
        embed.setDescription(description + '\n');
    }

    embed.setThumbnail('https://cdn.discordapp.com/attachments/1380658799286947960/1391783221531906099/3.png?ex=68766122&is=68750fa2&hm=ac9d69f989c1e0819bc8e8a1fe1e1b1d1e890fa5c9d1c837b9505dbe096ce07e&');
    embed.setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&');

    return embed;
};

const updateOrderPanel = async () => {
    if (!orderPanelMessage) {
        console.log('[INFORMATION] Keine Panel Nachricht gefunden!');
        return;
    }

    const embed = createOrderPanel(); 
    try {
        await orderPanelMessage.edit({ embeds: [embed] });
        console.log('[INFORMATION] Order Panel wurde erfolgreich aktualisiert!');
    } catch (error) {
        console.log('[ERROR] Fehler beim Aktualisieren des Panels:', error);
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendorderpanel')
        .setDescription('📝 | Sende die Order-Warteliste'),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(process.env.ADMINROLEID)) {
            return interaction.reply({ content: '**❌** | Dazu hast du keine Berechtigung', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        const embed = createOrderPanel();
        try {
            orderPanelMessage = await interaction.channel.send({ embeds: [embed] });
            console.log('[INFORMATION] Order Panel wurde gesendet und in orderPanelMessage gespeichert!');
        } catch (err) {
            console.log('[ERROR] Fehler beim Senden der Nachricht:', err);
            return;
        }

        await interaction.editReply({ content: '**✔** | Du hast erfolgreich die Order-Warteliste gesendet!' });
    },

    updateOrderPanel
};
