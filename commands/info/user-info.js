const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');

function getUserInfo(author, language) {
    let activityDescription = '';
    if (author?.presence?.activities) {
        for (const activity of author.presence.activities) {
            // custom status
            if (activity.type === 4) {
                activityDescription += language.customStatus
                    .replace('<:${name}:${id}>', activity.emoji)
                    .replace('${state}', activity.state);
            } else {
                activityDescription += language.gameStatus
                    .replace('${type}', activity.type)
                    .replace('${name}', activity.name)
                    .replace('${details}', activity.details ? activity.details : '');
            }
        }
    } else {
        activityDescription = language.notPlaying;
    }
    return new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('User Info')
        .setAuthor({
            name: author.guild.name,
            iconURL: author.guild.iconURL({ dynamic: true }),
            url: 'https://loliconshelter.netlify.app/',
        })
        .setThumbnail(
            author.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
            }),
        )
        .addFields(
            {
                name: language.tag,
                value: author.user.tag,
                inline: true,
            },
            {
                name: language.nickname,
                value: author.displayName,
                inline: true,
            },
            {
                name: language.id,
                value: author.id,
                inline: true,
            },
            {
                name: language.avatarurl,
                value: language.avatarValue
                    .replace('${url}', author.user.displayAvatarURL({ format: 'png', dynamic: true })),
                inline: true,
            },
            {
                name: language.createdAt,
                value: author.user.createdAt.toLocaleDateString('zh-TW'),
                inline: true,
            },
            {
                name: language.joinedAt,
                value: author.joinedAt.toLocaleDateString('zh-TW'),
                inline: true,
            },
            {
                name: language.activity,
                value: activityDescription || 'None',
                inline: true,
            },
            {
                name: language.status,
                value: author?.presence?.status || 'Offline',
                inline: true,
            },
            {
                name: language.device,
                value: author?.presence?.clientStatus ? Object.keys(author.presence.clientStatus).join(', ') : 'None',
                inline: true,
            },
            {
                name: language.roles.replace('${author.roles.cache.size}', author.roles.cache.size),
                value: author.roles.cache.map((roles) => `${roles}`).join(', '),
                inline: false,
            },
        )
        .setTimestamp();
}
module.exports = {
    name: 'user-info',
    aliases: ['user', 'ui'],
    guildOnly: true,
    description: true,
    execute(message, _args, language) {
        if (!message.mentions.members.size) {
            const embed = getUserInfo(message.member);
            return reply(message, { embeds: [embed] });
        }

        const userInfoList = message.mentions.members.map((user) => {
            return getUserInfo(user, language);
        });
        return reply(message, { embeds: userInfoList });
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addUserOption((option) =>
                option.setName('member')
                    .setDescription('Member to display avatar'),
            ),
        execute(interaction, language) {
            const user = interaction.options.getMember('member');
            if (!user) {
                return reply(interaction, { embeds: [getUserInfo(interaction.member, language)] });
            }
            return reply(interaction, { embeds: [getUserInfo(user, language)] });
        },
    },
};
