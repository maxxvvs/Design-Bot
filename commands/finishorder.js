const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('finishorder')
        .setDescription('🛒 | gebe ein user seine Bestellung')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Wähle einen Benutzer aus')
                .setRequired(true))
        .addAttachmentOption(option => 
            option.setName('datei')
                .setDescription('Wähle die Datei aus')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(process.env.ADMINROLEID)) {
            return interaction.reply({ content: '**❌** | Dazu hast du keine Berechtigung', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const datei = interaction.options.getAttachment('datei');
        const memberavatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });
        const timestamp = Math.floor(Date.now() / 1000);

        if(datei.name.endsWith('zip') || datei.name.endsWith('zip') || datei.name.endsWith('rar')){

            const embed = new EmbedBuilder()
            .setColor(process.env.MAINCOLOR || '#00b2ff')
            .setTitle('Fertige Bestellung')
            .addFields(
                { name: '👤 Designer', value: `<@${interaction.member.id}>`, inline: true },
                { name: '📁 File Name', value: `\`${datei.name}\``, inline: true },
                { name: '✈ Gesendet', value: `<t:${timestamp}:R>`, inline: true },
                { name: '⬇ Downloaden', value: `[Klick um es zu downloaden](${datei.url})`, inline: false }
            )
            .setThumbnail(memberavatarURL)
            .setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&')

            interaction.reply({ content: `Du hast erfolgreich <@${user.id}> seine Designs gesendet!`, ephemeral: true })
            interaction.channel.send({ content: `<@${user.id}>`, embeds: [embed] })
            
            const checkbackupchannel = interaction.guild.channels.cache.get('backup channel id')

            if(checkbackupchannel && checkbackupchannel.type === ChannelType.GuildText){

            const buackupembed = new EmbedBuilder()
            .setColor(process.env.MAINCOLOR || '#00b2ff')
            .setTitle('Backup Bestellung')
            .addFields(
                { name: '👤 Gesendet', value: `<@${interaction.member.id}>`, inline: true },
                { name: '👤 Bekommen', value: `<@${user.id}>`, inline: true },
                { name: '📁 File Name', value: `\`${datei.name}\``, inline: true },
                { name: '📅 Gesendet', value: `<t:${timestamp}:F>`, inline: true },
                { name: '⬇ Downloaden', value: `[Klick um es zu downloaden](${datei.url})`, inline: false }
            )
            .setThumbnail(memberavatarURL)

                await checkbackupchannel.send({ embeds: [buackupembed] })
            } else {
                console.error('Backup Channel für "/finishorder" exesiert nicht! Channel ID: channel id vom backup channel')
            }

        } else {
            interaction.reply({ content: 'Du kannst nur ".zip, .7z oder .rar" sachen verschicken!', ephemeral: true })
        }
    }
};
