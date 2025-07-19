require('dotenv').config();
const fs = require('fs');
const { REST, Routes } = require('discord.js');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('[STARTING] Starte die Registrierung der Slash-Befehle...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
            { body: commands },
        );

        console.log('[ERFOLGREICH] Slash-Befehle erfolgreich registriert!');
    } catch (error) {
        console.error(error);
    }
})();
