const { SlashCommandBuilder } = require('@discordjs/builders');
const { updateOrderPanel } = require('./sendOrderPanel');
const orderManager = require('../orderManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addorderlist')
        .setDescription('🛒 | füge jemanden in die orderliste')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Wähle einen Benutzer aus')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Wähle ein Ticket aus')
                .addChannelTypes(0)
                .setRequired(true))
        .addStringOption(option => 
            option.setName('order')
                .setDescription('Was hat er bestellt')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(process.env.ADMINROLEID)) {
            return interaction.reply({ content: '**❌** | Dazu hast du keine Berechtigung', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const channel = interaction.options.getChannel('channel');
        const order = interaction.options.getString('order');

        try {

            orderManager.addOrder({ username: user.username, userid: user.id, channelId: channel.id, order });

            await channel.send('**`🛒`** | <@' + user.id + '> du wurdest erfolgreich von <@' + interaction.user.id +'> in die Warteliste hinzugefüght!');

            await updateOrderPanel();
            console.log('[INFORMATION] Order Panel wurde nach dem Hinzufügen aktualisiert');

            await interaction.reply({ content: `**✔** | Du hast erfolgreich <@${user.id}> zu der Warteliste hinzugefügt!`, ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: '**🛑** | Fehler beim Hinzufügen zur Warteliste: ' + error.message, ephemeral: true });
        }
    }
};
