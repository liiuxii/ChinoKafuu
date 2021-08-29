const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
function resume(command, language) {
    const queueData = require('../../data/queueData');
    const { queue } = queueData;
    const serverQueue = queue.get(command.guild.id);

    if (!command.member.voice.channel) {
        return commandReply.reply(command, language.notInVC, 'RED');
    }

    if (serverQueue) {
        if (serverQueue.playing) return commandReply.reply(command, 'I am already playing!', 'RED');
        serverQueue.connection.dispatcher.resume();
        serverQueue.playing = true;
        return commandReply.reply(command, 'Resumed!', 'GREEN');
    }
    return commandReply.reply(command, language.noSong, 'RED');
}
module.exports = {
    name: 'resume',
    guildOnly: true,
    description: 'Resume playing!',
    execute(message, _args, language) {
        resume(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .setName('resume')
            .setDescription('Resume playing!'),
        async execute(interaction, language) {
            resume(interaction, language);
        },
    },
};
