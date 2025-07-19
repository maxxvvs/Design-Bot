const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('senddesignerkurs')
        .setDescription('🖼 | sende den designer kus'),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(process.env.ADMINROLEID)) {
            return interaction.reply({ content: '**❌** | Dazu hast du keine Berechtigung', ephemeral: true });
        }


        await interaction.reply({ content: '**✔** | Du hast erfolgreich den Designer-Kurs gesendet', ephemeral: true });

        const ownerid = interaction.guild.members.cache.get('id des owners')
        const serverURL = interaction.guild.iconURL({ dynamic: true, size: 1024 });
        const memberavatarURL = ownerid.user.displayAvatarURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
        .setColor(process.env.MAINCOLOR || '#00b2ff')
        .setAuthor({ name: `${ownerid.user.displayName}`, iconURL: `${memberavatarURL}`, link: 'https://discordlookup.com/user/1389369320571801784' })
        .setTitle('Designer Kurs')
        .setDescription('> Lerne wie du mit __Photoshop, Illustrator und After Effects__ dein eigenen Designs Animiert und Static machen kannst\n\n__**Benötigt:**__\n> [Photoshop, Illustrator und After Effects](https://www.adobe.com/at/creativecloud/buy/students.html?gclid=Cj0KCQjwgrO4BhC2ARIsAKQ7zUkdwIbpaj51JPdioMviBIflowxzC_F8TrqVIRqDpJv6TERjFEDVzXUaAtnSEALw_wcB&mv=search&mv2=paidsearch&sdid=D8F91K7Y&ef_id=Cj0KCQjwgrO4BhC2ARIsAKQ7zUkdwIbpaj51JPdioMviBIflowxzC_F8TrqVIRqDpJv6TERjFEDVzXUaAtnSEALw_wcB:G:s&s_kwcid=AL!3085!3!599854006208!e!!g!!creative%20cloud!1427664420!59719821767&gad_source=1)\n\n__**Was lernst du?**__\n> Photoshop: Static Design erstellen\n> Illustrator: Vektorbasierte Logos und Formen\n> After Effects: Animierte Inhalte für FiveM\n> Arbeiten mit Plugins für 3D und Animation\n\n__**Price**__\n> <:ps:1292499426719436994> **Photoshop:** 10€\n> <:ai:1292499544617127946> **Illustrator:** 20€\n> <:ae:1292499500052512831> **After Effects:** 40€\n> <:paket:1298616994492321802> **Paket:** 65€\n\n__**Extras**__\n> <:plus:1298616991569018912> **Alle After Effects Plugins:** +10€')
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg/1200px-Adobe_Creative_Cloud_rainbow_icon.svg.png')
        .setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&')
        .setFooter({ text: 'Designer Kurs', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg/1200px-Adobe_Creative_Cloud_rainbow_icon.svg.png' });

        interaction.channel.send({ embeds: [embed] });
    }
};
