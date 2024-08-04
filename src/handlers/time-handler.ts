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

import _ from 'lodash';

import { client, localeManager as lm } from '../../index';
import * as guildInstance from '../util/guild-instance';
const { RustPlus } = require('../structures/RustPlus');
const Config = require('../../config');

export function timeHandler(rustplus: typeof RustPlus, time: any) {
    if (rustplus.time.timeTillActive) return;

    const prevTime = rustplus.time.time;
    const newTime = time.time;

    if (rustplus.isFirstPoll) {
        rustplus.time.startTime = newTime;
        rustplus.startTimeObject[newTime] = 0;
        return;
    }

    const distance = (prevTime > newTime) ? (24 - prevTime) + newTime : newTime - prevTime;
    if (distance > 1) {
        /* Too big of a jump for a normal server, might have been a skip night server */
        rustplus.error(lm.getIntl(Config.general.language, 'invalidTimeDistance', {
            distance: distance,
            prevTime: prevTime,
            newTime: newTime
        }));
        rustplus.passedFirstSunriseOrSunset = false;
        rustplus.time.startTime = newTime;
        rustplus.time.timeTillDay = new Object();
        rustplus.time.timeTillNight = new Object();
        rustplus.startTimeObject = new Object();
        rustplus.startTimeObject[newTime] = 0;
        return;
    }

    if (!rustplus.passedFirstSunriseOrSunset) {
        const a = (rustplus.time.startTime >= time.sunrise && rustplus.time.startTime < time.sunset) &&
            (newTime >= time.sunset || newTime < time.sunrise);
        const b = (rustplus.time.startTime >= time.sunset || rustplus.time.startTime < time.sunrise) &&
            (newTime >= time.sunrise && newTime < time.sunset);

        for (const id in rustplus.startTimeObject) {
            rustplus.startTimeObject[id] += (client.pollingIntervalMs / 1000);
        }

        if (a || b) {
            rustplus.passedFirstSunriseOrSunset = true;
        }
        else {
            rustplus.startTimeObject[newTime] = 0;
            return;
        }
    }

    const a = newTime > rustplus.time.startTime && prevTime < rustplus.time.startTime && newTime > prevTime;
    const b = newTime < rustplus.time.startTime && prevTime < rustplus.time.startTime && newTime < prevTime;
    const c = newTime > rustplus.time.startTime && prevTime > rustplus.time.startTime && newTime < prevTime;

    /* If 24 hours in-game time have passed */
    if (a || b || c) {
        /* Merge startTimeObject with correct object */
        let highestValue = 0;
        for (const id in rustplus.startTimeObject) {
            if (rustplus.startTimeObject[id] > highestValue) {
                highestValue = rustplus.startTimeObject[id];
            }
        }

        if (rustplus.time.startTime >= time.sunrise && rustplus.time.startTime < time.sunset) {
            for (const id in rustplus.time.timeTillNight) {
                rustplus.time.timeTillNight[id] += highestValue;
            }

            rustplus.time.timeTillNight = _.merge(rustplus.startTimeObject, rustplus.time.timeTillNight);
        }
        else {
            for (const id in rustplus.time.timeTillDay) {
                rustplus.time.timeTillDay[id] += highestValue;
            }

            rustplus.time.timeTillDay = _.merge(rustplus.startTimeObject, rustplus.time.timeTillDay);
        }

        rustplus.time.timeTillActive = true;

        const instance = guildInstance.readGuildInstanceFile(rustplus.guildId);

        instance.serverList[rustplus.serverId].timeTillDay = rustplus.time.timeTillDay;
        instance.serverList[rustplus.serverId].timeTillNight = rustplus.time.timeTillNight;
        guildInstance.writeGuildInstanceFile(rustplus.guildId, instance);

        rustplus.info(`${client.intlGet(null, 'timeCap')}: ${client.intlGet(null, '24HoursInGameTimePassed')}`);
        return;
    }

    if (newTime >= time.sunrise && newTime < time.sunset) { /* It's Day */
        for (const id in rustplus.time.timeTillNight) {
            rustplus.time.timeTillNight[id] += (client.pollingIntervalMs / 1000);
        }

        rustplus.time.timeTillNight[newTime] = 0;
    }
    else { /* It's Night */
        for (const id in rustplus.time.timeTillDay) {
            rustplus.time.timeTillDay[id] += (client.pollingIntervalMs / 1000);
        }

        rustplus.time.timeTillDay[newTime] = 0;
    }
}