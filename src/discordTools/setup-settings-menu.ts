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

import { Guild, AttachmentBuilder, TextChannel } from 'discord.js';
import * as path from 'path';

import { log, client } from '../../index';
import * as constants from '../util/constants';
import * as discordTools from './discord-tools';
import * as discordSelectMenus from './discord-select-menus';
import * as discordButtons from './discord-buttons';
import * as discordEmbeds from './discord-embeds';

export async function setupSettingsMenu(guild: Guild, forced: boolean = false) {
    const guildId = guild.id;
    const instance = client.getInstance(guildId);
    const channel = await discordTools.getTextChannel(guildId, instance.channelIds.settings);

    if (!channel) {
        log.error('SetupSettingsMenu: ' + client.intlGet(null, 'invalidGuildOrChannel'));
        return;
    }

    if (instance.firstTime || forced) {
        await discordTools.clearTextChannel(guildId, instance.channelIds.settings, 100);

        await setupGeneralSettings(guildId, channel);
        await setupNotificationSettings(guildId, channel);

        instance.firstTime = false;
        client.setInstance(guildId, instance);
    }
}

async function setupGeneralSettings(guildId: string, channel: TextChannel) {
    const instance = client.getInstance(guildId);

    await discordTools.messageSend(channel, {
        files: [new AttachmentBuilder(
            path.join(__dirname, '..',
                `resources/images/settings/general_settings_logo_${instance.generalSettings.language}.png`))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'selectLanguageSetting'),
            thumbnail: { url: `attachment://settings_logo.png` },
            fields: [
                {
                    name: client.intlGet(guildId, 'noteCap'),
                    value: client.intlGet(guildId, 'selectLanguageExtendSetting'),
                    inline: true
                }]
        })],
        components: [discordSelectMenus.getLanguageSelectMenu(guildId, instance.generalSettings.language)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'commandsVoiceGenderDesc'),
            thumbnail: { url: `attachment://settings_logo.png` }
        })],
        components: [discordSelectMenus.getVoiceGenderSelectMenu(guildId, instance.generalSettings.voiceGender)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'selectInGamePrefixSetting'),
            thumbnail: { url: `attachment://settings_logo.png` }
        })],
        components: [discordSelectMenus.getPrefixSelectMenu(guildId, instance.generalSettings.prefix)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'selectTrademarkSetting'),
            thumbnail: { url: `attachment://settings_logo.png` }
        })],
        components: [discordSelectMenus.getTrademarkSelectMenu(guildId, instance.generalSettings.trademark)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'shouldCommandsEnabledSetting'),
            thumbnail: { url: `attachment://settings_logo.png` }
        })],
        components: [discordButtons.getInGameCommandsEnabledButton(guildId,
            instance.generalSettings.inGameCommandsEnabled)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'shouldBotBeMutedSetting'),
            thumbnail: { url: `attachment://settings_logo.png` }
        })],
        components: [discordButtons.getBotMutedInGameButton(guildId, instance.generalSettings.muteInGameBotMessages)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'inGameTeamNotificationsSetting'),
            thumbnail: { url: `attachment://settings_logo.png` }
        })],
        components: [discordButtons.getInGameTeammateNotificationsButtons(guildId)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'commandDelaySetting'),
            thumbnail: { url: `attachment://settings_logo.png` }
        })],
        components: [discordSelectMenus.getCommandDelaySelectMenu(guildId, instance.generalSettings.commandDelay)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'shouldSmartAlarmNotifyNotConnectedSetting'),
            thumbnail: { url: `attachment://settings_logo.png` },
            fields: [
                {
                    name: client.intlGet(guildId, 'noteCap'),
                    value: client.intlGet(guildId, 'smartAlarmNotifyExtendSetting'),
                    inline: true
                }]
        })],
        components: [
            discordButtons.getFcmAlarmNotificationButtons(
                guildId,
                instance.generalSettings.fcmAlarmNotificationEnabled,
                instance.generalSettings.fcmAlarmNotificationEveryone)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'shouldSmartAlarmsNotifyInGameSetting'),
            thumbnail: { url: `attachment://settings_logo.png` },
        })],
        components: [discordButtons.getSmartAlarmNotifyInGameButton(guildId,
            instance.generalSettings.smartAlarmNotifyInGame)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'shouldSmartSwitchNotifyInGameWhenChangedFromDiscord'),
            thumbnail: { url: `attachment://settings_logo.png` },
        })],
        components: [discordButtons.getSmartSwitchNotifyInGameWhenChangedFromDiscordButton(guildId,
            instance.generalSettings.smartSwitchNotifyInGameWhenChangedFromDiscord)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'shouldLeaderCommandEnabledSetting'),
            thumbnail: { url: `attachment://settings_logo.png` }
        })],
        components: [discordButtons.getLeaderCommandEnabledButton(guildId,
            instance.generalSettings.leaderCommandEnabled)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'shouldLeaderCommandOnlyForPairedSetting'),
            thumbnail: { url: `attachment://settings_logo.png` },
        })],
        components: [discordButtons.getLeaderCommandOnlyForPairedButton(guildId,
            instance.generalSettings.leaderCommandOnlyForPaired)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'mapWipeDetectedNotifySetting', { group: '@everyone' }),
            thumbnail: { url: `attachment://settings_logo.png` }
        })],
        components: [discordButtons.getMapWipeNotifyEveryoneButton(instance.generalSettings.mapWipeNotifyEveryone)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'itemAvailableNotifyInGameSetting'),
            thumbnail: { url: `attachment://settings_logo.png` }
        })],
        components: [discordButtons.getItemAvailableNotifyInGameButton(guildId,
            instance.generalSettings.itemAvailableInVendingMachineNotifyInGame)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'displayInformationBattlemetricsAllOnlinePlayers'),
            thumbnail: { url: `attachment://settings_logo.png` }
        })],
        components: [discordButtons.getDisplayInformationBattlemetricsAllOnlinePlayersButton(guildId,
            instance.generalSettings.displayInformationBattlemetricsAllOnlinePlayers)],
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });

    await discordTools.messageSend(channel, {
        embeds: [discordEmbeds.getEmbed({
            color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
            title: client.intlGet(guildId, 'subscribeToChangesBattlemetrics'),
            thumbnail: { url: `attachment://settings_logo.png` }
        })],
        components: discordButtons.getSubscribeToChangesBattlemetricsButtons(guildId),
        files: [new AttachmentBuilder(
            path.join(__dirname, '..', 'resources/images/settings_logo.png'))]
    });
}

async function setupNotificationSettings(guildId: string, channel: TextChannel) {
    const instance = client.getInstance(guildId);

    await discordTools.messageSend(channel, {
        files: [new AttachmentBuilder(
            path.join(__dirname, '..',
                `resources/images/settings/notification_settings_logo_${instance.generalSettings.language}.png`))]
    });

    for (const setting in instance.notificationSettings) {
        await discordTools.messageSend(channel, {
            embeds: [discordEmbeds.getEmbed({
                color: discordEmbeds.colorHexToNumber(constants.COLOR_SETTINGS),
                title: client.intlGet(guildId, setting),
                thumbnail: { url: `attachment://${instance.notificationSettings[setting].image}` }
            })],
            components: [
                discordButtons.getNotificationButtons(
                    guildId, setting,
                    instance.notificationSettings[setting].discord,
                    instance.notificationSettings[setting].inGame,
                    instance.notificationSettings[setting].voice)],
            files: [
                new AttachmentBuilder(
                    path.join(__dirname, '..',
                        `resources/images/events/${instance.notificationSettings[setting].image}`))]
        });
    }
}