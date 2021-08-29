const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
function snipe(command, args, language) {
    const { MessageEmbed } = require('discord.js');
    const collection = command.client.snipeCollection;

    const snipeWithGuild = await collection.findOne({ id: command.guild.id });
    let snipes;

    if (snipeWithGuild) {
        snipes = snipeWithGuild.snipes;
    }
    else {
        return commandReply.reply(command, language.noSnipe, 'RED');
    }
    const arg = args[0] ?? 1;

    if (Number(arg) > 10) return commandReply.reply(command, language.exceed10, 'RED');
    const msg = snipes?.[Number(arg) - 1];
    if (!msg) return commandReply.reply(command, language.invalidSnipe, 'RED');

    const image = msg.attachments;

    const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor(msg.author, msg.authorAvatar)
        .setDescription(msg.content)
        .setFooter(msg.timestamp)
        .setImage(image);
    return commandReply.reply(command, embed);
}
module.exports = {
    name: 'snipe',
    guildOnly: true,
    description: true,
    async execute(message, args, language) {
        snipe(message, args, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .setName('snipe')
            .setDescription('Snipe a message')
            .addIntegerOption((option) => option.setName('number').setDescription('message to snipe')),
        async execute(interaction, language) {
            snipe(interaction, interaction.options.getInteger('number') ?? 1, language);
        },
    },
};
