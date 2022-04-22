const { reply } = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');
function server(command, language) {
    const embed = new MessageEmbed()
        .setTitle('Server Info')
        .setThumbnail(command.guild.iconURL())
        .setDescription(`Information about ${command.guild.name}`)
        .setColor('BLUE')
        .setAuthor({ name: `${command.guild.name} Info`, iconURL: command.guild.iconURL() })
        .addFields(
            { name: language.serverName, value: command.guild.name, inline: true },
            { name: language.serverOwner, value: command.guild.owner, inline: true },
            { name: language.memberCount, value: command.guild.memberCount, inline: true },
            { name: language.serverRegion, value: command.guild.region, inline: true },
            { name: language.highestRole, value: command.guild.roles.highest, inline: true },
            { name: language.serverCreatedAt, value: command.guild.createdAt, inline: true },
            { name: language.channelCount, value: command.guild.channels.cache.size, inline: true },
        )
        .setFooter({ text:'ChinoKafuu | Server Info', iconURL: command.client.user.displayAvatarURL() });
    return reply(command, { embeds: [embed] });
}
module.exports = {
    name: 'server',
    aliases: ['server-info'],
    description: {
        'en_US': 'Get information about server.',
        'zh_CN': '取得伺服器的基本资料',
        'zh_TW': '取得伺服器的基本資料',
    },
    guildOnly: true,
    cooldown: 5,
    async execute(message, _, language) {
        await server(message, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await server(interaction, language);
        },
    },
};
