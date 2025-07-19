const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendpreview')
        .setDescription('🖼 | sende ein Design in Preview rein')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Wähle ein Channel aus')
                .addChannelTypes(0)
                .setRequired(true))
        .addAttachmentOption(option => 
            option.setName('datei')
                .setDescription('Wähle die Datei aus')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(process.env.ADMINROLEID)) {
            return interaction.reply({ content: '**❌** | Dazu hast du keine Berechtigung', ephemeral: true });
        }

        const prchannel = interaction.options.getChannel('channel');
        const datei = interaction.options.getAttachment('datei');
        const serverURL = interaction.guild.iconURL({ dynamic: true, size: 1024 });

        if(datei.name.endsWith('png') || datei.name.endsWith('jpg') || datei.name.endsWith('gif')){

            const embed = new EmbedBuilder()
            .setColor(process.env.MAINCOLOR || '#00b2ff')
            .setTitle('Portfolio')
            .setImage(`${datei.url}`)
            .setFooter({ text: `Copyright©  ${interaction.guild.name}`, iconURL: serverURL })
            .setTimestamp();

            interaction.reply({ content: `Du hast erfolgreich eine Preview in <#${prchannel.id}> gesendet!`, ephemeral: true })
            prchannel.send({ embeds: [embed] })

        } else {
            interaction.reply({ content: 'Du kannst nur ".png, .jpg oder .gif" sachen in die preview packen!', ephemeral: true })
        }
    }
};
