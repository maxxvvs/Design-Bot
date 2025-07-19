const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendpreispanel')
        .setDescription('📃 | Sende die Preisliste'),

    async execute(interaction) {
        
        if (!interaction.member.roles.cache.has(process.env.ADMINROLEID)) {
            return interaction.reply({ content: '**`❌`** | Dazu hast du keine Rechte!', ephemeral: true })
        }

        const serverURL = interaction.guild.iconURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
        .setColor(process.env.MAINCOLOR || '#00b2ff')
        .setTitle('Preisliste')
        .setDescription('> » Klicke auf die Buttons um die Preislisten für die angeklickten Kategorien zu kriegen\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n __**Alle Preise sind inkl. 19% MwSt**__ \n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n**🛒 Bei Interessen oder Fragen?\n**┗**<#1393523018705277088>**')
        .setThumbnail(serverURL)
        .setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&')

        const staicbutton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('preis_static')
            .setLabel('Static')
            .setEmoji('<:ps:1292499426719436994>')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('preis_animated')
            .setLabel('Animated')
            .setEmoji('<:ae:1292499500052512831>')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('preis_sonstiges')
            .setLabel('Sonstiges')
            .setStyle(ButtonStyle.Secondary)
        )

    interaction.reply({ content: '**✔** | Du hast erfolgreich die Preislisten Panel gesendet', ephemeral: true })
    interaction.channel.send({embeds: [embed], components: [staicbutton]})

    }
}