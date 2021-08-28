module.exports = {
    name: 'skip',
    guildOnly: true,
    aliases: ['next'],
    description: true,
    execute(message, _args, language) {
        const queueData = require('../../data/queueData');
        const { queue } = queueData;
        const serverQueue = queue.get(message.guild.id);

        if (!message.member.voice.channel) {
            return message.channel.send(language.notInVC);
        }
        if (!serverQueue) {
            return message.channel.send(language.cantSkip);
        }
        serverQueue.connection.dispatcher.end();
    },
};
