const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply } = require('../../functions/commandReply.js');
const { checkStats } = require('../../functions/musicFunctions');
function remove(command, args, language) {
    const serverQueue = checkStats(command, language);
    if (serverQueue === 'error') return;

    if (serverQueue) {
        args.forEach((number) => {
            const queuenum = Number(number);
            if (Number.isInteger(queuenum) && queuenum <= serverQueue.songs.length && queuenum > 0) {
                serverQueue.songs.splice(queuenum, 1);
                return reply(command, language.removed.replace('${serverQueue.songs[queuenum].title}', serverQueue.songs[queuenum].title), 'GREEN');
            } else {
                return reply(command, language.invalidInt, 'RED');
            }
        });
    }
}
module.exports = {
    name: 'remove',
    guildOnly: true,
    aliases: ['r'],
    description: true,
    execute(message, args, language) {
        return remove(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addIntegerOption((option) => option.setName('index').setDescription('song to remove').setRequired(true)),
        execute(interaction, language) {
            return remove(interaction, [interaction.options.getInteger('index')], language);
        },
    },
};
