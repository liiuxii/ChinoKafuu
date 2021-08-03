module.exports = {
    name: "snipe",
    guildOnly: true,
    description: "Snipe a message.",
    async execute(message, args) {
        const Discord = require("discord.js");
        const collection = message.client.collection;

        let snipeWithGuild = await collection.findOne({ id: message.guild.id });
        let snipes;

        if (snipeWithGuild) {
            snipes = snipeWithGuild.snipes;
        } else {
            return message.channel.send("There's nothing to snipe!");
        }
        let arg = args[0] ?? 1;

        if (Number(arg) > 10) return message.channel.send("You can't snipe beyond 10!");
        let msg = snipes?.[Number(arg) - 1];
        if (!msg) return message.channel.send("Not a valid snipe!");

        let image = msg.attachments;

        let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(msg.author, msg.authorAvatar)
            .setDescription(msg.content)
            .setFooter(msg.timestamp)
            .setImage(image);
        return message.channel.send(embed);
    },
};
