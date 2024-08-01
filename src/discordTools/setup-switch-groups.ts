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

import * as guildInstance from '../util/guild-instance';
import * as discordTools from './discord-tools';
import * as discordMessages from './discord-messages';
const { RustPlus } = require('../structures/RustPlus.js');

export async function setupSwitchGroups(rustplus: typeof RustPlus) {
    const guildId = rustplus.guildId;
    const instance = guildInstance.readGuildInstanceFile(guildId);

    if (rustplus.isNewConnection && instance.channelIds.switchGroups !== null) {
        await discordTools.clearTextChannel(guildId, instance.channelIds.switchGroups, 100);
    }

    for (const groupId in instance.serverList[rustplus.serverId].switchGroups) {
        await discordMessages.sendSmartSwitchGroupMessage(guildId, rustplus.serverId, groupId);
    }
}