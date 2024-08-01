/*
    Copyright (C) 2024 Alexander Emanuelsson (alexemanuelol)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    https://github.com/alexemanuelol/rustplusplus

*/

import * as fs from 'fs';
import * as path from 'path';
import { Guild } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { log, client, localeManager as lm } from '../../index';
const Config = require('../../config');

export async function registerSlashCommands(guild: Guild) {
    const guildId = guild.id;
    const commands = [];
    const commandFiles = fs.readdirSync(path.join(__dirname, '..', 'commands')).filter(file =>
        file.endsWith('.js') || file.endsWith('.ts'));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        commands.push(command.getData(client, guildId).toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(Config.discord.token);

    try {
        await rest.put(Routes.applicationGuildCommands(Config.discord.clientId, guildId), { body: commands });
    }
    catch (e) {
        log.error(lm.getIntl(Config.general.language, 'couldNotRegisterSlashCommands', { guildId: guildId }) +
            lm.getIntl(Config.general.language, 'makeSureApplicationsCommandsEnabled'));
        process.exit(1);
    }
    log.info(lm.getIntl(Config.general.language, 'slashCommandsSuccessRegister', { guildId: guildId }));
}