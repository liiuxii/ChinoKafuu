const { SlashCommandBuilder } = require('@discordjs/builders');
const { reply, edit } = require('../../functions/commandReply.js');
const { MessageEmbed } = require('discord.js');
const google = require('googlethis');

async function googleFunc(command, keyword, _language) {
    const options = {
        page: 0,
        safe: false,
        additional_params: {
            hl: 'zh_TW',
        },
    };
    const response = await google.search(keyword, options);
    const images = await google.image(keyword, options);
    const cleanPanel = { ...response.knowledge_panel };
    // delete this 5 keys from response
    ['title', 'description', 'url', 'images', 'type'].forEach(key => delete cleanPanel[key]);
    for (const [key, value] of Object.entries(response.knowledge_panel)) {
        // remove unavailable keys
        if (value === 'N/A') delete response.knowledge_panel[key];
    }

    // knowledge_panel probably doesn't exist, use first result instead
    if (!response.knowledge_panel.title && !response.knowledge_panel.url && !response.knowledge_panel.description) {
        response.knowledge_panel.title = response.results[0].title;
        response.knowledge_panel.url = response.results[0].url;
        response.knowledge_panel.description = response.results[0].description;
    }

    if (response.knowledge_panel && Object.keys(response.knowledge_panel).length !== 0) {
        const fields = [];
        for (const [key, value] of Object.entries(cleanPanel)) {
            const entry = {};
            entry['name'] = key;
            entry['value'] = value;
            fields.push(entry);
        }
        const knowledgePanel = new MessageEmbed()
            .setTitle(`Knowledge Panel: ${response.knowledge_panel.title ?? 'None'}`)
            .setDescription(response.knowledge_panel.description)
            .setURL(response.knowledge_panel.url)
            .setFields(fields)
            .setImage(response.knowledge_panel.images?.[0] ?? images?.[0]?.url ?? '')
            .setColor('BLUE');
        await edit(command, knowledgePanel);
    }
}

module.exports = {
    name: 'google',
    description: true,
    async execute(message, _args, language) {
        const repliedMsg = await message.channel.send('Please wait...');
        await googleFunc(repliedMsg, message.content.substr(message.content.indexOf(' ') + 1), language);
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .addStringOption((option) => option.setName('query').setDescription('Search google').setRequired(true)),
        async execute(interaction, language) {
            await interaction.deferReply();
            await googleFunc(interaction, interaction.options.getString('query'), language);
        },
    },
};
