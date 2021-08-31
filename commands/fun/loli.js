const { SlashCommandBuilder } = require('@discordjs/builders');
const CommandReply = require('../../functions/commandReply.js');
const commandReply = new CommandReply();
function loli(command, language) {
    const fs = require('fs');
    const Discord = require('discord.js');

    const imageFiles = fs
        .readdirSync('./images')
        .filter((file) => file.endsWith('.json'));
    const pictures = {};

    for (const filename of imageFiles) {
        const rawdata = fs.readFileSync(`./images/${filename}`);
        pictures[filename] = JSON.parse(rawdata);
    }

    const target = ['蘿莉圖.json'];
    let random = Math.floor(Math.random() * target.length);
    const targetFile = target[random];
    const pic = pictures[targetFile];
    random = Math.floor(Math.random() * pic.length);
    const images = pic[random];
    const { messageurl } = images;
    random = Math.floor(Math.random() * images.attachments.length);
    const imageInfo = images.attachments[random];
    const embed = new Discord.MessageEmbed()
        .setColor('#2d9af8')
        .setTitle(language.loliPic)
        .setDescription(language.loliProvider.replace('${images.author}', images.author).replace('${messageurl}', messageurl))
        .setImage(imageInfo.url)
        .setFooter(
            '蘿莉控的FBI避難所',
            'https://cdn.discordapp.com/icons/764839074228994069/5be3f532073fdae6a9d934e1c6f6a2b5.png?size=2048',
        );
    commandReply.reply(command, embed);
}
module.exports = {
    name: 'loli',
    cooldown: 3,
    description: true,
    execute(message, _args, language) {
        loli(message, language);
    },
    slashCommand: {
        data: new SlashCommandBuilder(),
        async execute(interaction, language) {
            loli(interaction, language);
        },
    },
};
