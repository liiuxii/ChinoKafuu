const { reply } = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

async function snipe(command, args, language) {
    const collection = command.client.snipeCollection;

    let snipeWithGuild;
    if (collection) {
        snipeWithGuild = await collection.findOne({ id: command.guild.id });
    } else {
        const rawData = fs.readFileSync('./data/snipes.json', 'utf-8');
        snipeWithGuild = JSON.parse(rawData);
    }
    let snipes;

    if (snipeWithGuild) {
        snipes = snipeWithGuild.snipes;
    } else {
        return reply(command, language.noSnipe, 'RED');
    }
    const arg = args[0] ?? 1;

    if (Number(arg) > 10) return reply(command, language.exceed10, 'RED');
    const msg = snipes?.[Number(arg) - 1];
    if (!msg) return reply(command, language.invalidSnipe, 'RED');

    const image = msg.attachments;

    const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor({ name: msg.author, iconURL: msg.authorAvatar })
        .setDescription(msg.content)
        .setTimestamp(msg.timestamp)
        .setImage(image);
    return reply(command, { embeds: [embed] });
}
module.exports = {
    name: 'snipe',
    guildOnly: true,
    description: {
        'en_US': 'Snipe a message.',
        'zh_CN': '狙击一条讯息',
        'zh_TW': '狙擊一條訊息',
    },
    options: [
        {
            name: 'number',
            description: {
                'en_US': 'message to snipe, default to 1',
                'zh_CN': '要狙击的讯息，默認為1',
                'zh_TW': '要狙擊的訊息，默認為1',
            },
            type: 'INTEGER',
            required: true,
        },
    ],
    async execute(message, args, language) {
        await snipe(message, args, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await snipe(interaction, [interaction.options.getInteger('number') ?? 1], language);
        },
    },
};
