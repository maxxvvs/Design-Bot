const { SlashCommandBuilder } = require('@discordjs/builders');
const { updateOrderPanel } = require('./sendOrderPanel');
const orderManager = require('../orderManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeorderlist')
        .setDescription('🛒 | Entferne jemanden aus der Order-Liste')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Wähle einen Benutzer aus')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(process.env.ADMINROLEID)) {
            return interaction.reply({ content: '**❌** | Dazu hast du keine Berechtigung', ephemeral: true });
        }

        const user = interaction.options.getUser('user');

        try {

            const existingOrder = orderManager.getOrderByUserId(user.id);

            if (!existingOrder) {
                return interaction.reply({ content: `**❌** | <@${user.id}> befindet sich nicht auf der Warteliste.`, ephemeral: true });
            }

            orderManager.removeOrderByUserId(user.id);

            await updateOrderPanel();
            console.log('Order Panel wurde nach dem Entfernen aktualisiert');

            await interaction.reply({ content: `**✔** | <@${user.id}> wurde von der Warteliste entfernt.`, ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: '**🛑** | Fehler beim Entfernen von der Warteliste: ' + error.message, ephemeral: true });
        }
    }
};
