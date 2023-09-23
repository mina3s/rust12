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

const Axios = require('axios');
const Cheerio = require('cheerio');

const Constants = require('../util/constants.js');

module.exports = {
    scrape: async function (url) {
        try {
            return await Axios.get(url);
        }
        catch (e) {
            return {};
        }
    },

    scrapeSteamProfilePicture: async function (client, steamId) {
        const response = await module.exports.scrape(`${Constants.STEAM_PROFILES_URL}${steamId}`);

        if (response.status !== 200) {
            client.log(client.intlGet(null, 'errorCap'), client.intlGet(null, 'failedToScrapeProfilePicture', {
                link: `${Constants.STEAM_PROFILES_URL}${steamId}`
            }), 'error');
            return null;
        }

        let png = response.data.match(/<img src="(.*_full.jpg)(.*?(?="))/);
        if (png) {
            return png[1];
        }

        return null;
    },

    scrapeSteamProfileName: async function (client, steamId) {
        const response = await module.exports.scrape(`${Constants.STEAM_PROFILES_URL}${steamId}`);

        if (response.status !== 200) {
            client.log(client.intlGet(null, 'errorCap'), client.intlGet(null, 'failedToScrapeProfileName', {
                link: `${Constants.STEAM_PROFILES_URL}${steamId}`
            }), 'error');
            return null;
        }

        let regex = new RegExp(`class="actual_persona_name">(.+?)</span>`, 'gm');
        let data = regex.exec(response.data);
        if (data) {
            return data[1];
        }

        return null;
    },

    scrapeRustLabs: async function (client, item) {
        item = item.toLowerCase().replace(/\s/g, '-');
        const response = await module.exports.scrape(`${Constants.RUSTLABS_URL}${item}`);
        console.log(`${Constants.RUSTLABS_URL}${item}`)

        if (response.status !== 200) {
            client.log(client.intlGet(null, 'errorCap'), client.intlGet(null, 'failedToScrapeRustLabs', {
                link: `${Constants.RUSTLABS_URL}/${item}`
            }), 'error');
            return null;
        }

        const $ = Cheerio.load(response.data);
        const resultArray = [];

        $('div[data-name="blueprint"] > table > tbody > tr').each((i, element) => {
            const $element = $(element);
            const item = $element.find('td:nth-child(2)').text();
            const scrap = $element.find('td:nth-child(4)').text();
            resultArray.push({ item, scrap });
        });

        return resultArray;

    },
}