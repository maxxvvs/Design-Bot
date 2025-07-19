const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addkunde')
        .setDescription('🛒 | füge ein kunden hinzu')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Wähle einen Benutzer aus')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(process.env.ADMINROLEID)) {
            return interaction.reply({ content: '**❌** | Dazu hast du keine Berechtigung', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const memberavatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

        const seerole = interaction.guild.roles.cache.get('kunden rolle');

        if(seerole){
            const member = interaction.guild.members.cache.get(user.id);
            member.roles.add(seerole)
                .then(() => {
                    interaction.reply({ content: `**✔** | Du hast erfolgreich <@${user.id}> als Kunde hinzugefügt!`, ephemeral: true });
                    const embed = new EmbedBuilder()
                        .setColor(process.env.MAINCOLOR || "#00b2ff")
                        .setTitle('Neue Neuigkeiten!')
                        .setDescription('> Lieber <@&kunden rolle>\n> Deine Zahlung wurde bestätigt und deine Bestellung in die Warteliste verschoben!\n\n> *Bei weiteren Fragen zu deiner Bestellung kannst du das Team mit einem Ping erreichen*')
                        .setThumbnail(memberavatarURL)
                        .setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&')
                        .setTimestamp();

                    interaction.channel.send({ content: `<@${user.id}>`, embeds: [embed] });
                })
                .catch(error => {
                    console.error(error);
                    interaction.reply({ content: 'Es gab einen Fehler beim Hinzufügen der Rolle.', ephemeral: true });
                });
        } else {
            return interaction.reply({ content: 'Die Kunden Rolle existiert nicht! ROLEID: rolle id der kunden rolle', ephemeral: true });
        }
    }
};
