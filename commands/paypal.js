const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('paypal')
        .setDescription('💵 | Sende die information über paypal'),

    async execute(interaction) {
        
    const embed = new EmbedBuilder()
    .setColor(process.env.MAINCOLOR || "#00b2ff")
    .setTitle('PayPal')
    .addFields(
        { name: '👑 Überweisung an', value: '<@1389369320571801784>', inline: true },
        { name: '💵 Geschäfts Server', value: interaction.guild.name, inline: true },
        { name: '__Anmerkung__', value: '> **E-Mail:** stonedleaks@gmail.com\n> **Bezahlung:** Freunde und Familie', inline: false }
    )
    .setThumbnail('https://cdn.discordapp.com/attachments/1380658799286947960/1391783221531906099/3.png?ex=68766122&is=68750fa2&hm=ac9d69f989c1e0819bc8e8a1fe1e1b1d1e890fa5c9d1c837b9505dbe096ce07e&')
    .setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&')
        

    interaction.reply({ embeds: [embed] })

    }
}