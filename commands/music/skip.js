module.exports = {
    name: "skip",
    guildOnly: true,
    aliases: ["s"],
    description: true,
    execute(message, _args, language) {
        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);

        function skip(message, serverQueue) {
            if (!message.member.voice.channel) {
                return message.channel.send(language.notInVC);
            }
            if (!serverQueue) {
                return message.channel.send(language.cantSkip);
            }
            serverQueue.connection.dispatcher.end();
        }
        skip(message, serverQueue);
    },
};
