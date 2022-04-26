const { success } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
async function skip(command, language) {
    const serverQueue = await checkStats(command);
    if (serverQueue === 'error') return;

    serverQueue.player.stop();
    return success(command, language.skipped);
}
module.exports = {
    name: 'skip',
    guildOnly: true,
    aliases: ['next'],
    description: {
        'en_US': 'Skips a song.',
        'zh_CN': '跳过歌曲',
        'zh_TW': '跳過歌曲',
    },
    execute(message, _args, language) {
        return skip(message, language);
    },
    slashCommand: {
        execute(interaction, language) {
            return skip(interaction, language);
        },
    },
};
