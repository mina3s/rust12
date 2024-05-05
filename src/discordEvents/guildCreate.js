/*
    Copyright (C) 2022 Alexander Emanuelsson (alexemanuelol)

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

const createCredentialsFile = require('../../dist/util/CreateCredentialsFile').default;
const GuildInstance = require('../../dist/util/GuildInstance.js');

module.exports = {
    name: 'guildCreate',
    async execute(client, guild) {
        GuildInstance.createGuildInstanceFile(guild.id);
        const guildInstance = GuildInstance.readGuildInstanceFile(guild.id);
        client.setInstance(guild.id, guildInstance); // TODO! TEMP
        createCredentialsFile(guild);

        client.fcmListenersLite[guild.id] = new Object();

        client.loadGuildIntl(guild.id);

        await client.setupGuild(guild);
    },
}