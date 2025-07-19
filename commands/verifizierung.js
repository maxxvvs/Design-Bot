const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendverfypanel')
        .setDescription('📃 | Sende die Verifizierung'),

    async execute(interaction) {
        
        if (!interaction.member.roles.cache.has(process.env.ADMINROLEID)) {
            return interaction.reply({ content: '**❌** | Dazu hast du keine Rechte!', ephemeral: true })
        }

        const embed = new EmbedBuilder()
        .setColor(process.env.MAINCOLOR || '#00b2ff')
        .setTitle('Mufasa | Regeln')
        .setDescription(`
            **Werbung**

Es ist nicht gestattet, Werbung jeglicher Art zu betreiben.
Es ist untersagt, Teammitglieder unaufgefordert anzuschreiben oder ohne wichtigen Grund zu benachrichtigen.


**Angemessenes Verhalten**

Ein respektvoller Umgangston ist Pflicht. Beleidigungen, rassistische Äußerungen und Spam sind nicht erlaubt. Jeder Kanal hat eine bestimmte Funktion und sollte entsprechend genutzt werden; beispielsweise ist der Feedback Kanal nicht für persönliche Gespräche gedacht.


**Respekt für Privatsphäre**

Das Bloßstellen anderer Nutzer in Text- oder Sprachkanälen ist untersagt. Dazu zählen auch das Teilen von kompromittierenden Clips oder Bildern.


**Authentizität**

Das Vortäuschen einer anderen Identität ist strengstens untersagt.


**Sicherheit**

Der Serverinhaber wird zu keinem Zeitpunkt nach Passwörtern oder persönlichen Anmeldedaten fragen. Ebenso werden keine „Free Discord Nitro“-Angebote ohne vorherige Genehmigung verteilt (Vorsicht vor Betrug!).

**Servereigentum**

Der Serverinhaber behält sich das uneingeschränkte Eigentumsrecht am Discord-Server vor. Das bedeutet, dass Regeln jederzeit ohne Vorankündigung geändert oder entfernt werden können.


Discord Nutzungsbedingungen:
https://discord.com/terms
            `)
        .setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&')

        const verybutton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('verifizeriung')
            .setLabel('Verifizieren')
            .setStyle(ButtonStyle.Success)
        )

    interaction.reply({ content: '**✔** | Du hast erfolgreich das Verifizierguns Panel gesendet', ephemeral: true })
    interaction.channel.send({embeds: [embed], components: [verybutton]})
    
    }
}