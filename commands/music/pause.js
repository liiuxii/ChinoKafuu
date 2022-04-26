const { success } = require('../../functions/Util.js');
const { checkStats } = require('../../functions/musicFunctions');
async function pause(command, language) {
    const serverQueue = await checkStats(command, true);
    if (serverQueue === 'error') return;

    if (serverQueue) {
        serverQueue.player.pause(true);
        serverQueue.playing = false;
        return success(command, language.pause);
    }
}
module.exports = {
    name: 'pause',
    guildOnly: true,
    description: {
        'en_US': 'Pause the song!',
        'zh_CN': '暂停播放歌曲！',
        'zh_TW': '暫停播放歌曲！',
    },
    execute(message, _args, language) {
        return pause(message, language);
    },
    slashCommand: {
        execute(interaction, language) {
            return pause(interaction, language);
        },
    },
};
