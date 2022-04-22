const { reply } = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');
const api = require('novelcovid');
api.settings({
    baseUrl: 'https://disease.sh',
});
const DynamicEmbed = require('../../functions/dynamicEmbed');
const dynamicEmbed = new DynamicEmbed();

async function covid(command, args, language) {
    /**
     * Create a Discord embed message
     * @param {object} result - The result from the API.
     * @return {MessageEmbed} Discord embed
     */
    function createEmbed(result) {
        const date = new Date(result.updated);
        return new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(language.covidTitle.replace('${result.country}', result.country))
            .setAuthor({
                name: 'ChinoKafuu',
                iconURL: 'https://cdn.discordapp.com/avatars/781328218753859635/af716f0a9958679bdb17edfc0add53a6.png?size=256',
            })
            .addFields(
                {
                    name: language.totalCases,
                    value: result.cases.toLocaleString(),
                    inline: true,
                },
                {
                    name: language.confirmedToday,
                    value: result.todayCases.toLocaleString(),
                    inline: true,
                },
                {
                    name: language.totalDeaths,
                    value: result.deaths.toLocaleString(),
                    inline: true,
                },
                {
                    name: language.deathsToday,
                    value: result.todayDeaths.toLocaleString(),
                    inline: true,
                },
                {
                    name: language.totalRecovered,
                    value: result.recovered.toLocaleString(),
                    inline: true,
                },
                {
                    name: language.recoveredToday,
                    value: result.todayRecovered.toLocaleString(),
                    inline: true,
                },
                {
                    name: language.activeCases,
                    value: result.active.toLocaleString(),
                    inline: true,
                },
                {
                    name: language.criticalCases,
                    value: result.critical.toLocaleString(),
                    inline: true,
                },
                {
                    name: language.population,
                    value: result.population.toLocaleString(),
                    inline: true,
                },
            )
            .setThumbnail(result.countryInfo?.flag)
            .setFooter({
                text: language.covidFooter
                    .replace('${message.author.tag}', command.member.user.tag)
                    .replace('${date.toUTCString()}', date.toUTCString()),
                iconURL: command.member.user.avatarURL(),
            });
    }

    if (args.length < 1) {
        // no arguments were provided
        await reply(command, language.invalidArgument, 'RED');
        return reply(command, language.covidExample, 'RED');
    }
    if (args[0] === 'global') {
        // get global covid data
        const result = await api.all({ allowNull: false });
        result.country = 'Global';
        return reply(command, { embeds: [createEmbed(result)] });
    }
    if (args[0] === 'countries') {
        // get a list of data of all countries sorted by cases
        const result = await api.countries({ sort: 'cases', allowNull: false });
        return dynamicEmbed.createEmbedFlip(command, result, ['⬅️', '➡️'], createEmbed);
    }
    if (args.length > 1) {
        // get a list of data of multiple specific countries
        const result = await api.countries({ country: args, allowNull: false });
        return dynamicEmbed.createEmbedFlip(command, result, ['⬅️', '➡️'], createEmbed);
    }
    // get a list of data of a single specific countries
    const result = await api.countries({ country: args, allowNull: false });
    return reply(command, { embeds: [createEmbed(result)] });
}
module.exports = {
    name: 'covid',
    description: {
        'en_US': 'Get latest global/country covid status!',
        'zh_CN': '取得最新的全球/国家的新冠肺炎状态!',
        'zh_TW': '取得最新的全球/國家的新冠肺炎狀態!',
    },
    options: [
        {
            name: 'mode',
            description: {
                'en_US': 'Search mode(global/countries/[country name])',
                'zh_CN': '搜索模式(global/countries/国家名字（英语）)',
                'zh_TW': '搜索模式(global/countries/國家名字（英語）)',
            },
            type: 'STRING',
            required: true,
        },
    ],
    async execute(message, args, language) {
        await covid(message, args, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await covid(interaction, [interaction.options.getString('mode')], language);
        },
    },
};
