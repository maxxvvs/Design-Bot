require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { getFeedbackMessage, setFeedbackMessage } = require('./sharedState');
const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { permission } = require('process');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', async () => {

    console.log(`---Bot Informationen---\nBot: ${client.user.username}\nAuf Server: ${client.guilds.cache.size || 'Keine'}\nErsteller: Suspect.1337\nVersion: ${require('./package.json').version || 'Keine'}\n---Bot Informationen---`);

    await client.user.setActivity('discord.gg/Dk8XAeCTMs', { type: 'PLAYING' })

})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);

    } catch (error) {
        console.error(error);

        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({ content: '**`🛑`** | Es ist ein Fehler aufgetreten!', ephemeral: true });
        } else {
            await interaction.reply({ content: '**`🛑`** | Es ist ein Fehler aufgetreten!', ephemeral: true });
        }
    }
});

// Verifizierung

client.on('interactionCreate', async interaction => {
    if(!interaction.isButton) return;

    if(interaction.customId === 'verifizeriung'){

        const roleextist = interaction.guild.roles.cache.find(rl => rl.id === 'rolle die der beim verifizieren bekommt');

        if(!roleextist){
            return interaction.reply({ content: '**`🛑`** | Die Rolle Exesitiert nicht mehr!', ephemeral: true })
        }

        if(interaction.member.roles.cache.has('rolle von der member rolle die man beim verifizieren bekommt')){
            return interaction.reply({ content: '**`ℹ`** | Du hast dich bereits Verifiziert!', ephemeral: true })
        } else {

            interaction.member.roles.add(roleextist)

            return interaction.reply({ content: '**`✔`** | Du hast dich erfolgreich Verifiziert!', ephemeral: true })
        }        
    }
})

// Willkommen

client.on('guildMemberAdd', async (member) => {

    const channel = member.guild.channels.cache.get('channel wo die willkommensnachricht gesendet werden soll');
    if (!channel) return console.error('[WILLKOMMEN] Channel nicht gefunden!');

    const accountcreatetime = Math.floor(member.user.createdTimestamp / 1000);
    const serverURL = member.guild.iconURL({ dynamic: true, size: 1024 });

    const willkommenembed = new EmbedBuilder()
        .setColor(process.env.MAINCOLOR || '#00b2ff')
        .setTitle('Willkommen auf dem Server!')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&')
        .setDescription(`Herlich Willkommen <@${member.id}>,\nWenn du hilfe oder Fragen hast kontaktiere gerne den support unter <#1393523018705277088>`)
        .addFields(
            { name: '👤 Member', value: `<@${member.user.id}>`, inline: true },
            { name: '👤 Username', value: `${member.user.username}`, inline: true },
            { name: '📅 Account erstellt', value: `<t:${accountcreatetime}:R>`, inline: true }
        )
        .setFooter({ text: 'discord.gg/stonedleaks', iconURL: serverURL })

    await channel.send({ embeds: [willkommenembed] });
});

// Booster Nachricht

client.on('guildMemberUpdate', async (oldMember, newMember) => {

    if (!oldMember.premiumSince && newMember.premiumSince) {
        const guild = newMember.guild;

        const boostTier = guild.premiumTier;
        const boostCount = guild.premiumSubscriptionCount;

        const channel = guild.channels.cache.get('Channel wo die booster nachricht gesendet werden soll');
        if (!channel) return console.error('[BOOSTERR] Channel nicht gefunden!');

        if (channel) {
            const embed = new EmbedBuilder()
                .setColor(process.env.MAINCOLOR || '#00b2ff')
                .setTitle('Server geboostet!')
                .setDescription(`> Danke <@${newMember.user.id}>,\n> Das du __${guild.name}__ untersetützt mit dein Nitro Booster :D`)
                .setFields(
                    { name: '👤 Geboostet', value: `<@${newMember.user.id}>`, inline: false},
                    { name: '<:nitrowantsyou:1205327620464582736> Insgeammte Booster', value: '```' + boostCount + '```', inline: true},
                    { name: '📈 Server Boost Tier', value: `${boostTier}`, inline: true}
                )
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                .setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&')
                .setTimestamp();

            channel.send({ embeds: [embed] });
        }
    }
});

// Preis Buttons

client.on('interactionCreate', async interaction => {

    if(!interaction.isButton) return;

    if(interaction.customId === 'preis_static'){

        const embed = new EmbedBuilder()
        .setColor(process.env.MAINCOLOR || '#00b2ff')
        .setTitle('Preislite - Static')
        .setDescription('Das sind die Preise für die Static Designs')
        .addFields(
            { name: '<:ps:1292499426719436994> __Photoshop__', value: '\n**»Server Banner**\nPreis: 5€\n**┗**<#1273268922182799392>\n\n**»User Banner**\nPreis: 5€\n**┗**<#1273268925559345274>\n\n**»FiveM Banner**\nPreis: 3€\n**┗**<#1273268932161048637>\n\n**»ESX Banner**\nPreis: 3€\n**┗**<#1273268935520682006>\n\n**»Invite Banner**\nPreis: 5€\n**┗**<#1294934593929216040>\n\n**»Embeds**\nPreis: 1€ Pro Stück\n**┗**<#1294935256129998848>\n\n', inline: false },
            { name: '<:ai:1292499544617127946> __Illustrator__', value: '\n**»Transparent Logo**\nPreis: 5€\n**┗**<#1273278651101610006>', inline: false },
            { name: '<:payget:1297324124863205488> __Zahlungsmethoden__', value: '\n> <:paypal:1297324432628645949> PayPal', inline: false }
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/1380658799286947960/1391783221531906099/3.png?ex=68766122&is=68750fa2&hm=ac9d69f989c1e0819bc8e8a1fe1e1b1d1e890fa5c9d1c837b9505dbe096ce07e&')
        .setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&')

    interaction.reply({ embeds: [embed], ephemeral: true })

    }

    if(interaction.customId === 'preis_animated'){

        const embed = new EmbedBuilder()
        .setColor(process.env.MAINCOLOR || '#00b2ff')
        .setTitle('Preislite - Animated')
        .setDescription('Das sind die Preise für die Animierten Designs')
        .addFields(
            { name: '<:ae:1292499500052512831> After Effects', value: '\n**»Animated Logo**\nPreis: 5€\n**┗**<#1273268918202535987>\n\n**»Server Banner**\nPreis: 7€\n**┗**<#1273268922182799392>\n\n**»User Banner**\nPreis: 6€\n**┗**<#1273268925559345274>\n\n**»Connect Banner**\nPreis: 6€\n**┗**<#1273268929367769179>\n\n**»FiveM Banner**\nPreis: 7,50€\n**┗**<#1273268932161048637>\n\n**»ESX Banner**\nPreis: 3€\n**┗**<#1273268935520682006>\n\n', inline: true },
            { name: '<:payget:1297324124863205488> Zahlungsmethoden', value: '\n> <:paypal:1297324432628645949> PayPal', inline: false }
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/1380658799286947960/1391783221531906099/3.png?ex=68766122&is=68750fa2&hm=ac9d69f989c1e0819bc8e8a1fe1e1b1d1e890fa5c9d1c837b9505dbe096ce07e&')
        .setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&')

    interaction.reply({ embeds: [embed], ephemeral: true })

    }

    if(interaction.customId === 'preis_sonstiges'){

        const embed = new EmbedBuilder()
        .setColor(process.env.MAINCOLOR || '#00b2ff')
        .setTitle('Preislite - Sonstiges')
        .setDescription('Das sind die Preise für die Sonstige Designs')
        .addFields(
            { name: '🖌 Sonstige', value: '\n**»Tastaturbelegung**\nPreis: 6€\n**┗**<#1273268960388841523>\n\n**»Intro**\nPreis: 8€\n**┗**<#1273268963580706817>', inline: true },
            { name: '<:payget:1297324124863205488> Zahlungsmethoden', value: '\n> <:paypal:1297324432628645949> PayPal', inline: false }
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/1380658799286947960/1391783221531906099/3.png?ex=68766122&is=68750fa2&hm=ac9d69f989c1e0819bc8e8a1fe1e1b1d1e890fa5c9d1c837b9505dbe096ce07e&')
        .setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&')

    interaction.reply({ embeds: [embed], ephemeral: true })

    }

})

// Select Menu

client.on('interactionCreate', async interaction => {

    if(!interaction.isStringSelectMenu()) return;

    if(interaction.customId === 'select_ticket'){

        const auswahl = interaction.values[0];

        const ticketcheck = fs.readFileSync('datenbank/ticketdata.json');
        const ticketcheckconverter = JSON.parse(ticketcheck);

        const channelticketcheck = fs.readFileSync('datenbank/ticket.json');
        const channelticketcheckconverter = JSON.parse(channelticketcheck);

        const memberavatarURL = interaction.user.displayAvatarURL({ dynamic: true, size: 1024 });
        const timestamp = Math.floor(Date.now() / 1000);
        const interactionmember = interaction.user.id;

        if (auswahl === 'nothing_ticket'){
            return interaction.reply({ content: 'OK 👍', ephemeral: true });
        }

        if(auswahl === 'buy_ticket'){

            await interaction.reply({ content: `Dein Ticket wird erstellt! Bitte warten...`, ephemeral: true })

            if(ticketcheckconverter[interactionmember]){
                return interaction.editReply({ content: `**❌** | Du hast bereits ein offenes Ticket! <#${ticketcheckconverter[interactionmember].ticket}>`, ephemeral: true })
            }

            const buyticket = await interaction.guild.channels.create(
                {
                    name: `buy-${interactionmember}`,
                    type: 0,
                    topic: `💵 Kauf Ticket - <@${interactionmember}> | 🕐 Erstellt: <t:${timestamp}:R>`,
                    parent: 'kategorie wo das ticket eröffnet werden soll',
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id, 
                            deny: ['ViewChannel', 'SendMessages']
                        },
                        {
                            id: interactionmember, 
                            allow: ['SendMessages', 'ViewChannel']
                        }
                    ]
                }
            )

            if (interaction.member.roles.cache.has('rolle')) {
                await buyticket.setParent('kategorie wo das ticket eröffnet werden soll');
                
                await buyticket.permissionOverwrites.edit(interaction.guild.id, {
                    ViewChannel: false,
                    SendMessages: false
                });
                
                await buyticket.permissionOverwrites.edit(interaction.member.id, {
                    ViewChannel: true,
                    SendMessages: true
                });
            }
            

        ticketcheckconverter[interactionmember] = { ticket: buyticket.id, owner: interactionmember, erstellt: timestamp, thema: 'buy' }
        channelticketcheckconverter[buyticket.id] = { owner: interactionmember, ticket: buyticket.id }

        const buyembed = new EmbedBuilder()
        .setColor(process.env.MAINCOLOR || '#00b2ff')
        .setTitle('Kauf Ticket')
        .addFields(
            { name: '👤 Ersteller', value: `<@${interactionmember}>`, inline: true },
            { name: '🕐 Erstellt', value: `<t:${timestamp}:R>`, inline: true },
            { name: '📃 Beschreibung', value: 'Schreibe bitte daweiln was du hättest und wie du dir es vorstellst bis der ein Designer antwortet', inline: false }
        )
        .setThumbnail(memberavatarURL)

        const ticketbuttonbuy = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`close-${buyticket.id}`)
            .setLabel('Close')
            .setEmoji('🔐')
            .setStyle(ButtonStyle.Danger)
        )

        await buyticket.send({ content: `<@${interactionmember}>`, embeds: [buyembed], components: [ticketbuttonbuy] })
        await interaction.editReply({ content: `**✔** | Dein "Kauf Ticket" wurde erfolgreich erstellt! ${buyticket}`, ephemeral: true })

        fs.writeFileSync('datenbank/ticketdata.json', JSON.stringify(ticketcheckconverter, null, 2))
        fs.writeFileSync('datenbank/ticket.json', JSON.stringify(channelticketcheckconverter, null, 2))
        
        } 
        
        if(auswahl === 'support_ticket'){

            await interaction.reply({ content: `Dein Ticket wird erstellt! Bitte warten...`, ephemeral: true })

            if(ticketcheckconverter[interactionmember]){
                return interaction.editReply({ content: `**❌** | Du hast bereits ein offenes Ticket! <#${ticketcheckconverter[interactionmember].ticket}>`, ephemeral: true })
            }

            const supportticket = await interaction.guild.channels.create(
                {
                    name: `support-${interactionmember}`,
                    type: 0,
                    topic: `📨 Support Ticket - <@${interactionmember}> | 🕐 Erstellt: <t:${timestamp}:R>`,
                    parent: 'kategorie wo das ticket eröffnet werden soll',
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id, 
                            deny: ['ViewChannel', 'SendMessages']
                        },
                        {
                            id: interactionmember, 
                            allow: ['SendMessages', 'ViewChannel']
                        }
                    ]
                }
            )
        
            if (interaction.member.roles.cache.has('rolle')) {
                await supportticket.setParent('kategorie wo das ticket eröffnet werden soll');
                
                await supportticket.permissionOverwrites.edit(interaction.guild.id, {
                    ViewChannel: false,
                    SendMessages: false
                });
                
                await supportticket.permissionOverwrites.edit(interaction.member.id, {
                    ViewChannel: true,
                    SendMessages: true
                });
            }

        ticketcheckconverter[interactionmember] = { ticket: supportticket.id, owner: interactionmember, erstellt: timestamp, thema: 'support' }
        channelticketcheckconverter[supportticket.id] = { owner: interactionmember, ticket: supportticket.id }

        const supportembed = new EmbedBuilder()
        .setColor(process.env.MAINCOLOR || '#00b2ff')
        .setTitle('Support Ticket')
        .addFields(
            { name: '👤 Ersteller', value: `<@${interactionmember}>`, inline: true },
            { name: '🕐 Erstellt', value: `<t:${timestamp}:R>`, inline: true },
            { name: '📃 Beschreibung', value: 'Schreibe bitte daweiln was deine Frage ist oder wobei du hilfe brauchst', inline: false }
        )
        .setThumbnail(memberavatarURL)

        const ticketbuttonsuppor = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`close-${supportticket.id}`)
            .setLabel('Close')
            .setEmoji('🔐')
            .setStyle(ButtonStyle.Danger)
        )

        await supportticket.send({ content: `<@${interactionmember}>`, embeds: [supportembed], components: [ticketbuttonsuppor] })
        await interaction.editReply({ content: `**✔** | Dein "Support Ticket" wurde erfolgreich erstellt! ${supportticket}`, ephemeral: true })

    fs.writeFileSync('datenbank/ticketdata.json', JSON.stringify(ticketcheckconverter, null, 2))
    fs.writeFileSync('datenbank/ticket.json', JSON.stringify(channelticketcheckconverter, null, 2))
        
        } 

        if(auswahl === 'giveaway_ticket'){

            await interaction.reply({ content: `Dein Ticket wird erstellt! Bitte warten...`, ephemeral: true })

            if(ticketcheckconverter[interactionmember]){
                return interaction.editReply({ content: `**❌** | Du hast bereits ein offenes Ticket! <#${ticketcheckconverter[interactionmember].ticket}>`, ephemeral: true })
            }

            const giveawayticket = await interaction.guild.channels.create(
                {
                    name: `giveaway-${interactionmember}`,
                    type: 0,
                    topic: `🎉 Giveaway Ticket - <@${interactionmember}> | 🕐 Erstellt: <t:${timestamp}:R>`,
                    parent: 'kategorie wo das ticket eröffnet werden soll',
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id, 
                            deny: ['ViewChannel', 'SendMessages']
                        },
                        {
                            id: interactionmember, 
                            allow: ['SendMessages', 'ViewChannel']
                        }
                    ]
                }
            )

            if (interaction.member.roles.cache.has('rolle')) {
                await giveawayticket.setParent('kategorie wo das ticket eröffnet werden soll');
                
                await giveawayticket.permissionOverwrites.edit(interaction.guild.id, {
                    ViewChannel: false,
                    SendMessages: false
                });
                
                await giveawayticket.permissionOverwrites.edit(interaction.member.id, {
                    ViewChannel: true,
                    SendMessages: true
                });
            }

        ticketcheckconverter[interactionmember] = { ticket: giveawayticket.id, owner: interactionmember, erstellt: timestamp, thema: 'giveaway' }
        channelticketcheckconverter[giveawayticket.id] = { owner: interactionmember, ticket: giveawayticket.id }

        const giveawayembed = new EmbedBuilder()
        .setColor(process.env.MAINCOLOR || '#00b2ff')
        .setTitle('Giveaway Ticket')
        .addFields(
            { name: '👤 Ersteller', value: `<@${interactionmember}>`, inline: true },
            { name: '🕐 Erstellt', value: `<t:${timestamp}:R>`, inline: true },
            { name: '📃 Beschreibung', value: 'Schreibe bitte daweiln rein was du gewonnen hast', inline: false }
        )
        .setThumbnail(memberavatarURL)

        const ticketbuttongiveaway = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`close-${giveawayticket.id}`)
            .setLabel('Close')
            .setEmoji('🔐')
            .setStyle(ButtonStyle.Danger)
        )

        await giveawayticket.send({ content: `<@${interactionmember}>`, embeds: [giveawayembed], components: [ticketbuttongiveaway] })
        await interaction.editReply({ content: `**✔** | Dein "Giveaway Ticket" wurde erfolgreich erstellt! ${giveawayticket}`, ephemeral: true })

    fs.writeFileSync('datenbank/ticketdata.json', JSON.stringify(ticketcheckconverter, null, 2))
    fs.writeFileSync('datenbank/ticket.json', JSON.stringify(channelticketcheckconverter, null, 2))
        
        } 

        if(auswahl === 'partnerschafts_ticket'){

            await interaction.reply({ content: `Dein Ticket wird erstellt! Bitte warten...`, ephemeral: true })

            if(ticketcheckconverter[interactionmember]){
                return interaction.editReply({ content: `**❌** | Du hast bereits ein offenes Ticket! <#${ticketcheckconverter[interactionmember].ticket}>`, ephemeral: true })
            }

            const partnerschaftticket = await interaction.guild.channels.create(
                {
                    name: `partnerschaft-${interactionmember}`,
                    type: 0,
                    topic: `🤝 Partnerschaft Ticket - <@${interactionmember}> | 🕐 Erstellt: <t:${timestamp}:R>`,
                    parent: 'kategorie wo das ticket eröffnet werden soll',
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id, 
                            deny: ['ViewChannel', 'SendMessages']
                        },
                        {
                            id: interactionmember, 
                            allow: ['SendMessages', 'ViewChannel']
                        }
                    ]
                }
            )

            if (interaction.member.roles.cache.has('rolle')) {
                await partnerschaftticket.setParent('kategorie wo das ticket eröffnet werden soll');
                
                await partnerschaftticket.permissionOverwrites.edit(interaction.guild.id, {
                    ViewChannel: false,
                    SendMessages: false
                });
                
                await partnerschaftticket.permissionOverwrites.edit(interaction.member.id, {
                    ViewChannel: true,
                    SendMessages: true
                });
            }

        ticketcheckconverter[interactionmember] = { ticket: partnerschaftticket.id, owner: interactionmember, erstellt: timestamp, thema: 'partnerschaft' }
        channelticketcheckconverter[partnerschaftticket.id] = { owner: interactionmember, ticket: partnerschaftticket.id }

        const partnerschaftembed = new EmbedBuilder()
        .setColor(process.env.MAINCOLOR || '#00b2ff')
        .setTitle('Partnerschafts Ticket')
        .addFields(
            { name: '👤 Ersteller', value: `<@${interactionmember}>`, inline: true },
            { name: '🕐 Erstellt', value: `<t:${timestamp}:R>`, inline: true },
            { name: '📃 Beschreibung', value: 'Schreibe bitte dein Server Invite link rein, und warum du mit uns gepartnert sein willst', inline: false }
        )
        .setThumbnail(memberavatarURL)

        const ticketbuttonpartnerschaft = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`close-${partnerschaftticket.id}`)
            .setLabel('Close')
            .setEmoji('🔐')
            .setStyle(ButtonStyle.Danger)
        )

        await partnerschaftticket.send({ content: `<@${interactionmember}>`, embeds: [partnerschaftembed], components: [ticketbuttonpartnerschaft] })
        await interaction.editReply({ content: `**✔** | Dein "Partnerschafts Ticket" wurde erfolgreich erstellt! ${partnerschaftticket}`, ephemeral: true })

    fs.writeFileSync('datenbank/ticketdata.json', JSON.stringify(ticketcheckconverter, null, 2))
    fs.writeFileSync('datenbank/ticket.json', JSON.stringify(channelticketcheckconverter, null, 2))
        
        } 
    }
})

// Button Ticket

client.on('interactionCreate', async interaction => {

    if(!interaction.isButton()) return;

    const memberavatarURL = interaction.user.displayAvatarURL({ dynamic: true, size: 1024 });
    const timestamp = Math.floor(Date.now() / 1000);
    const interactionmember = interaction.user.id;

    const ticketcheck = fs.readFileSync('datenbank/ticketdata.json');
    const ticketcheckconverter = JSON.parse(ticketcheck);

    const channelticketcheck = fs.readFileSync('datenbank/ticket.json');
    const channelticketcheckconverter = JSON.parse(channelticketcheck);

    if(!channelticketcheckconverter[interaction.channel.id]){
        if(interaction.customId === `close-${interaction.channel.id}`){
            await interaction.reply({ content: 'Das Ticket wird in 5 Sekunden gelöscht...' })
        
            setTimeout(() => {
                interaction.channel.delete()
            }, 5000)
        } return;
    }

    if(interaction.customId === `close-${channelticketcheckconverter[interaction.channel.id].ticket}`){

    const toclose = channelticketcheckconverter[interaction.channel.id].owner;

    const buyticketclose = await interaction.guild.channels.cache.find(ch => ch.name === `${ticketcheckconverter[toclose].thema}-${channelticketcheckconverter[interaction.channel.id].owner}`);

    if(!buyticketclose){
        return await interaction.reply({ content: 'Das Ticket konnte nicht geschlossen werden!', ephemeral: true })
    }

    if(buyticketclose){
        await buyticketclose.edit(
            {
                name: `close-${channelticketcheckconverter[interaction.channel.id].owner}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id, 
                        deny: ['SendMessages', 'ViewChannel']
                    },
                    {
                        id: channelticketcheckconverter[interaction.channel.id].owner, 
                        deny: ['SendMessages', 'ViewChannel']
                    }
                ],
            }
        )

    }
        
    const embedcolosebuy = new EmbedBuilder()
    .setColor(process.env.MAINCOLOR || '#00b2ff')
    .setTitle('Ticket Geschlossen')
    .addFields(
        { name: '👤 Geschlossen', value: `<@${interactionmember}>`, inline: true },
        { name: '👤 Geöffnet von', value: `<@${channelticketcheckconverter[interaction.channel.id].owner}>`, inline: true },
        { name: '🕐 Geschlossen', value: `<t:${timestamp}:R>`, inline: true }
    )

    const buttondeletebuey = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId(`delete_ticket-${interaction.channel.id}`)
        .setLabel('Ticket Löschen')
        .setEmoji('🗑')
        .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
        .setCustomId(`reopen_ticket-${interaction.channel.id}`)
        .setLabel('Reopen')
        .setEmoji('🚪')
        .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
        .setCustomId(`achiv_ticket-${interaction.channel.id}`)
        .setLabel('Ticket Speichern')
        .setEmoji('💾')
        .setStyle(ButtonStyle.Success)
    )

    menumenssage = await interaction.reply({embeds: [embedcolosebuy], components: [buttondeletebuey]})

    }

    // Delete

    if(interaction.customId === `delete_ticket-${interaction.channel.id}`){    

    const getnormaldata = channelticketcheckconverter[interaction.channel.id].owner;

    const checkclosed = await interaction.guild.channels.cache.find(ch => ch.name === `close-${channelticketcheckconverter[interaction.channel.id].owner}`);

    if(!channelticketcheckconverter[interaction.channel.id]){
        if(interaction.customId === `delete_ticket-${interaction.channel.id}`){
            await interaction.reply({ content: 'Das Ticket wird in 5 Sekunden gelöscht...' })
    
            setTimeout(() => {
                interaction.channel.delete()
            }, 5000)
        } return;
    }

    if(!checkclosed){
        return await interaction.reply( { content: 'Das Ticket ist nicht geschlossen!', ephemeral: true } )
    }

    if(checkclosed){

        const deleteticketbuy = new EmbedBuilder()
        .setColor(process.env.MAINCOLOR || '#00b2ff')
        .setTitle('Ticket wird gelöscht | 5 Sekunden')
        .setFields(
            { name: '👤 Gelöscht', value: `<@${interactionmember}>`, inline: true },
            { name: '👤 Ticket ersteller', value: `<@${channelticketcheckconverter[interaction.channel.id].owner}>`, inline: true }
        )

    await interaction.reply({ embeds: [deleteticketbuy] })

    delete ticketcheckconverter[getnormaldata]
    delete channelticketcheckconverter[interaction.channel.id]

    setTimeout(() => {
        checkclosed.delete()
    }, 5000)

    fs.writeFileSync('datenbank/ticketdata.json', JSON.stringify(ticketcheckconverter, null, 2))
    fs.writeFileSync('datenbank/ticket.json', JSON.stringify(channelticketcheckconverter, null, 2))
    }

    }

    // Reopen

    if(interaction.customId === `reopen_ticket-${interaction.channel.id}`){

    const getnormaldata = channelticketcheckconverter[interaction.channel.id].owner;

    const checkticketexist = await interaction.guild.channels.cache.find(ch => ch.name === `close-${channelticketcheckconverter[interaction.channel.id].owner}`);

    if(!checkticketexist){
        return await interaction.reply({ content: `Das Ticket ist nicht geschlossen!`, ephemeral: true })
    }

    if(checkticketexist){

            await checkticketexist.edit(
                {
                    name: `${ticketcheckconverter[getnormaldata].thema}-${channelticketcheckconverter[interaction.channel.id].owner}`,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id, 
                            deny: ['ViewChannel', 'SendMessages']
                        },
                        {
                            id: channelticketcheckconverter[interaction.channel.id].owner, 
                            allow: ['SendMessages', 'ViewChannel']
                        }
                    ],
                }
            )

        const embedreopen = new EmbedBuilder()
        .setColor(process.env.MAINCOLOR || '#00b2ff')
        .setTitle('Ticket wieder geöffnet')
        .setFields(
            { name: '👤 Reopen', value: `<@${interactionmember}>`, inline: true },
            { name: '👤 Ticket öffner', value: `<@${channelticketcheckconverter[interaction.channel.id].owner}>`, inline: true },
            { name: '🕐 Reopen', value: `<t:${timestamp}:R>`, inline: true }
        )

        const deletebutton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`antdelete-${interaction.channel.id}`)
            .setLabel('Ticket Löschen')
            .setEmoji('🗑')
            .setStyle(ButtonStyle.Danger)
        )

        interaction.reply({ embeds: [embedreopen], components: [deletebutton] })

        }

    }

    // Speichern

    if(interaction.customId === `achiv_ticket-${interaction.channel.id}`){

        const getnormaldata = channelticketcheckconverter[interaction.channel.id].owner;
    
        const checkticketexist = await interaction.guild.channels.cache.find(ch => ch.name === `close-${channelticketcheckconverter[interaction.channel.id].owner}`);

        if(!checkticketexist){
            return await interaction.reply({ content: `Das Ticket ist nicht geschlossen!`, ephemeral: true })
        }
    
        if(checkticketexist){
    
                await checkticketexist.edit(
                    {
                        name: `${ticketcheckconverter[getnormaldata].thema}-${channelticketcheckconverter[interaction.channel.id].owner}`,
                        parent: '1393520279338356756',
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id, 
                                deny: ['ViewChannel', 'SendMessages']
                            },
                            {
                                id: channelticketcheckconverter[interaction.channel.id].owner, 
                                deny: ['SendMessages', 'ViewChannel']
                            }
                        ],
                    }
                )
    
                if(interaction.customId === `achiv_ticket-${interaction.channel.id}`){
                    if(menumenssage){
                        await menumenssage.delete()
                    } else {
                        console.log('Keine Nachricht zum löschen')
                    }
                }

                const isvipcheck = channelticketcheckconverter[interaction.channel.id].owner;
                let vip = 'NOTHING'

                if(isvipcheck){
                    const ticketoper = interaction.guild.members.cache.get(isvipcheck);

                    if(ticketoper?.roles.cache.has('rolle die tickets eröffnen dürfen')){
                        vip = 'JA'
                    } else {
                        vip = 'NEIN'
                    }
                } else {
                    vip = 'Inhaber nicht gefunden'
                }

            const embedreopen = new EmbedBuilder()
            .setColor(process.env.MAINCOLOR || '#00b2ff')
            .setTitle('Ticket Gespeichert')
            .setFields(
                { name: '👤 Gespeichert', value: `<@${interactionmember}>`, inline: true },
                { name: '👤 Ticket öffner', value: `<@${channelticketcheckconverter[interaction.channel.id].owner}>`, inline: true },
                { name: '💎 VIP', value: vip, inline: true },
                { name: '🕐 Gespeichert', value: `<t:${timestamp}:F> (<t:${timestamp}:R>)`, inline: false }
            )
    
            interaction.channel.send({ embeds: [embedreopen] })
    
            delete ticketcheckconverter[getnormaldata]
            delete channelticketcheckconverter[interaction.channel.id]

            fs.writeFileSync('datenbank/ticketdata.json', JSON.stringify(ticketcheckconverter, null, 2))
            fs.writeFileSync('datenbank/ticket.json', JSON.stringify(channelticketcheckconverter, null, 2))
            }
    
        }

    // Endgültig Löschen

    if(interaction.customId === `antdelete-${interaction.channel.id}`){

        interaction.reply('Das Ticket wird in 5 Sekunden gelöscht')

        const getnormaldata = channelticketcheckconverter[interaction.channel.id].owner;

        delete ticketcheckconverter[getnormaldata]
        delete channelticketcheckconverter[interaction.channel.id]

        fs.writeFileSync('datenbank/ticketdata.json', JSON.stringify(ticketcheckconverter, null, 2))
        fs.writeFileSync('datenbank/ticket.json', JSON.stringify(channelticketcheckconverter, null, 2))

        setTimeout(() => {

            interaction.channel.delete()

        }, 5000)

    }
})

// FeedBack System

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === 'feedback-button') {
            const modal = new ModalBuilder()
                .setCustomId('sendfeedback')
                .setTitle(`${interaction.guild.name} - Feedback`);

            const starsInput = new TextInputBuilder()
                .setCustomId('feedbackstars')
                .setLabel('Wie viele Sterne bekommen wir? (1-5)')
                .setPlaceholder('1 = 1 Stern, 2 = 2 Sterne, etc.')
                .setMinLength(1)
                .setMaxLength(1)
                .setRequired(true)
                .setStyle(TextInputStyle.Short);

            const feedbackInput = new TextInputBuilder()
                .setCustomId('feedbacktext')
                .setLabel('Feedback')
                .setPlaceholder('Schreib dein ehrliches Feedback...')
                .setMinLength(10)
                .setMaxLength(1024)
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph);

            const firstActionRow = new ActionRowBuilder().addComponents(starsInput);
            const secondActionRow = new ActionRowBuilder().addComponents(feedbackInput);

            modal.addComponents(firstActionRow, secondActionRow);

            await interaction.showModal(modal);
        }
    }

    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'sendfeedback') {
            const stars = interaction.fields.getTextInputValue('feedbackstars');
            const feedback = interaction.fields.getTextInputValue('feedbacktext');

            const feedbackchannel = interaction.guild.channels.cache.get('feedbackchannelid');

            if (!feedbackchannel) {
                return interaction.reply({ content: 'Feedback Kanal nicht gefunden!', ephemeral: true });
            }


            const starMap = [
                '<:starfull:1297572791826251827><:starnull:1297572790165045288><:starnull:1297572790165045288><:starnull:1297572790165045288><:starnull:1297572790165045288>',
                '<:starfull:1297572791826251827><:starfull:1297572791826251827><:starnull:1297572790165045288><:starnull:1297572790165045288><:starnull:1297572790165045288>',
                '<:starfull:1297572791826251827><:starfull:1297572791826251827><:starfull:1297572791826251827><:starnull:1297572790165045288><:starnull:1297572790165045288>',
                '<:starfull:1297572791826251827><:starfull:1297572791826251827><:starfull:1297572791826251827><:starfull:1297572791826251827><:starnull:1297572790165045288>',
                '<:starfull:1297572791826251827><:starfull:1297572791826251827><:starfull:1297572791826251827><:starfull:1297572791826251827><:starfull:1297572791826251827>'
            ];

            let startsfeed = starMap[stars - 1];
            
            if (!startsfeed || stars < 1 || stars > 5 || isNaN(stars)) {
                return interaction.reply({ content: `Du kannst nur: 1, 2, 3, 4 oder 5 machen! Deine Sterne: "${stars}"`, ephemeral: true });
            }

            const memberavatarURL = interaction.user.displayAvatarURL({ dynamic: true, size: 1024 });
            const serverURL = interaction.guild.iconURL({ dynamic: true, size: 1024 });
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            const messageCount = messages.size;

            const feedembed = new EmbedBuilder()
                .setColor(process.env.MAINCOLOR || "#00b2ff")
                .setTitle('Neues Feedback')
                .setAuthor({ name: `${interaction.guild.name}`, iconURL: `${serverURL}` })
                .addFields(
                    { name: 'Kunde:', value: `<@${interaction.user.id}>`, inline: false },
                    { name: 'Bewertung:', value: `${startsfeed}`, inline: true },
                    { name: 'Nachrichten:', value: `${messageCount}`, inline: true },
                    { name: 'Feedback:', value: feedback, inline: false }
                )
                .setThumbnail(memberavatarURL)
                .setImage('https://cdn.discordapp.com/attachments/1380658799286947960/1393673997677367326/stonedleaks_best_banner_ever.png?ex=6876aa8e&is=6875590e&hm=affc8586ab7f8d8e841a790c2e1d90958533d4e115d2df09887256c55db4a073&')
                .setFooter({ text: 'FeedBack' })
                .setTimestamp();

            await interaction.reply({ content: 'Danke für dein ehrliches Feedback! :D', ephemeral: true });
            await feedbackchannel.send({ embeds: [feedembed] });

            const feedbackMessage = getFeedbackMessage();
            if (feedbackMessage) {
                await feedbackMessage.delete();
                setFeedbackMessage(null);
            }
        }
    }
});


client.login(process.env.TOKEN);