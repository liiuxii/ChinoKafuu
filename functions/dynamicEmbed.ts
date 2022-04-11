import { Message, MessageReaction, MessageEmbed, ReactionCollector, User } from "discord.js";

class DynamicEmbed {
    /**
     * Function to update embed message after a user had reacted
     * @param {MessageReaction} r - Reaction from the user
     * @param {number} page - Which result to be displayed
     * @param {object[]} itemList - The result from the API.
     * @param {Message} embedMessage - Discord message with an embed.
     * @param {function} createEmbed - Function to create embed.
     * @param {ReactionCollector} collector - Discord reaction collector.
     * @param {function} collectorFunc - Function after stopping the collector.
     * @param {any[]} collectorParams - parameters for collector function.
     * @returns {number} Page
     */
    async updateEmbed(r: MessageReaction, page: number, itemList: object[], embedMessage: Message, createEmbed: (item: object) => MessageEmbed, collector: ReactionCollector, collectorFunc: (...collectorParams: any[]) => void, collectorParams: any[]) {
        let editedEmbed: MessageEmbed;
        switch (r.emoji.name) {
            case "⬅️":
                page -= 1;
                if (page < 0) page = itemList.length - 1;
                itemList["page"] = page;
                itemList["total"] = itemList.length
                editedEmbed = createEmbed(itemList[page]);
                await embedMessage.edit({ embeds: [editedEmbed] });
                if (collectorParams && collectorParams.length > 1) {
                    collectorParams[1] = page;
                }
                break;
            case "➡️":
                page += 1;
                if (page + 1 > itemList.length) page = 0;
                itemList["page"] = page;
                itemList["total"] = itemList.length
                editedEmbed = createEmbed(itemList[page]);
                await embedMessage.edit({ embeds: [editedEmbed] });
                if (collectorParams && collectorParams.length > 1) {
                    collectorParams[1] = page;
                }
                break;
            case "▶️":
                collector.stop();
                collectorFunc(...collectorParams);
                await embedMessage.delete();
                break;
        }
        return page;
    }

    /**
     * Creates and sends a reactable message
     * @param {Message} message - Message that initiated this function
     * @param {object[]} itemList - Result from API call
     * @param {string[]} emojiList - Emoji used to control dynamic embed
     * @param {function} createEmbed - Function to create embed
     * @param {function} collectorFunc - Function to tell what is the next thing to do after receiving an emoji
     * @param {any[]} collectorParams - collectorFunc's params
     */
    async createEmbedFlip(message: Message, itemList: object[], emojiList: string[], createEmbed: (item: object) => MessageEmbed, collectorFunc?: (collectorParams: any[]) => void, collectorParams?: any[]) {
        let page = 0;
        if (typeof itemList[page] === "object") {
            itemList["page"] = page;
            itemList["total"] = itemList.length
        }
        let embed = createEmbed(itemList[page]);
        let embedMessage = await message.channel.send({ embeds: [embed] });
        for (let emoji of emojiList) {
            await embedMessage.react(emoji);
        }
        const filter = (reaction: MessageReaction, user: User) => emojiList.includes(reaction.emoji.name) && !user.bot;
        const collector = embedMessage.createReactionCollector({
            filter,
            idle: 600000,
            dispose: true,
        });
        collector.on("collect", async (r: MessageReaction) => {
            page = await this.updateEmbed(r, page, itemList, embedMessage, createEmbed, collector, collectorFunc, collectorParams);
        });
        collector.on("remove", async (r: MessageReaction) => {
            page = await this.updateEmbed(r, page, itemList, embedMessage, createEmbed, collector, collectorFunc, collectorParams);
        });
    }
}
module.exports = DynamicEmbed;