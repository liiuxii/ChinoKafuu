module.exports = {
    name: "play",
    guildOnly: true,
    aliases: ["p"],
    description: true,
    async execute(message, args, language) {
        const ytsr = require("youtube-sr").default;
        const ytpl = require("ytpl");
        const scID = process.env.SCID || require("../../config/config.json").scID;
        const SpotifyClientID = process.env.SPOTIFY_CLIENT_ID || require("../../config/config.json").SpotifyClientID;
        const SpotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET || require("../../config/config.json").SpotifyClientSecret;
        const scdl = require("soundcloud-downloader").default;
        const Spotify = require("../../functions/spotify");
        const spotify = new Spotify(SpotifyClientID, SpotifyClientSecret);
        const disbut = require("discord-buttons");

        const {waitimport, handleVideo} = require("../../functions/musicFunctions");
        const ytrx = new RegExp("(?:youtube\\.com.*(?:\\?|&)(?:v|list)=|youtube\\.com.*embed\\/|youtube\\.com.*v\\/|youtu\\.be\\/)((?!videoseries)[a-zA-Z0-9_-]*)");
        const scrxt = new RegExp("^(?<track>https://soundcloud.com/(?:(?!sets|stats|groups|upload|you|mobile|stream|messages|discover|notifications|terms-of-use|people|pages|jobs|settings|logout|charts|imprint|popular)(?:[a-z0-9-_]{1,25}))/(?:(?:(?!sets|playlist|stats|settings|logout|notifications|you|messages)(?:[a-z0-9-_]{1,100}))(?:/s-[a-zA-Z0-9-_]{1,10})?))(?:[a-z0-9-?=/]*)$");
        const sprxtrack = new RegExp("(http[s]?://)?(open.spotify.com)/");

        const queueData = require("../../data/queueData");
        let queue = queueData.queue;
        let serverQueue = queue.get(message.guild.id);
        let url = args[0];

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send(language.notInVC);
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send(language.cantJoinVC);
        }

        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                songHistory: [],
                volume: 5,
                playing: true,
                loop: false,
                filter: "",
            };
            queue.set(message.guild.id, queueConstruct);
            serverQueue = queue.get(message.guild.id);
        }

        async function processYoutubeLink(url) {
            if (!ytsr.validate(url, "PLAYLIST_ID")) {
                let videos = await ytsr.getVideo(args[0]);
                return handleVideo([videos], voiceChannel, false, serverQueue, "yt", message);
            }
            const playlist = await ytpl(url, {limit: Infinity});
            if (!playlist) return;
            let result = await waitimport(playlist.title, playlist.estimatedItemCount, message);
            if (result) {
                playlist.items.forEach((video) => handleVideo(video, voiceChannel, true, serverQueue, "ytlist", message));
            }
            return;
        }

        async function processSpotifyLink(url) {
            url = "spotify:" + url.replace(sprxtrack, "").replace("/", ":").replace("?.*", "");
            let part = url.split(":");
            let Id = part[part.length - 1];
            let result;

            if (url.includes("track")) {
                result = await spotify.gettrack(Id);
                let videos = await ytsr.search(
                    result.artists[0].name + " " + result.name,
                    { limit: 1 }
                );
                return await handleVideo(videos, voiceChannel, false, serverQueue, "yt", message);
            }

            if (url.includes("album")) {
                result = await spotify.getAlbum(Id);
                let title = result.name;
                let m = await message.channel.send(language.importAlbum1.replace("${title}", title));
                for (const i in result.tracks.items) {
                    let videos = await ytsr.search(
                        result.artists[0].name + " " + result.tracks.items[i].name,
                        { limit: 1 }
                    );
                    await handleVideo(videos, voiceChannel, true, serverQueue, "yt", message);
                    m.edit(language.importAlbum2.replace("${videos[0].title}", videos[0].title).replace("${i}", i));
                }
                return m.edit(language.importAlbumDone.replace("${title}", title));
            }

            if (url.includes("playlist")) {
                result = await spotify.getplaylist(Id);

                let title = result.name;
                let lenght = result.tracks.total;

                let wait = await waitimport(title, lenght, message);
                if (!wait) {
                    let videos = await ytsr.search(
                        result.tracks.items[0].track.artists[0].name + " " + result.tracks.items[0].track.name,
                        { limit: 1 }
                    );
                    return await handleVideo(videos, voiceChannel, false, serverQueue, "yt", message);
                }

                let m = await message.channel.send(language.importPlaylist1.replace("${title}", title));
                while (true) {
                    for (const i in result.tracks.items) {
                        let videos = await ytsr.search(
                            result.tracks.items[i].track.artists[0].name + " " + result.tracks.items[i].track.name,
                            { limit: 1 }
                        );
                        await handleVideo(videos, voiceChannel, true, serverQueue, "yt", message);
                        m.edit(language.importPlaylist2.replace("${videos[0].title}", videos[0].title).replace("${i}", i));
                    }
                    if (!result.tracks.next) {
                        break;
                    } else {
                        result = await spotify._make_spotify_req(result.tracks.next);
                        continue;
                    }
                }
                return m.edit(language.importPlaylistDone.replace("${title}", title));
            }
        }

        async function processSoundcloudLink(url) {
            if (scdl.isPlaylistURL(url)) {
                let data = await scdl.getSetInfo(url, scID).catch((err) => {
                    console.log(err);
                    return message.channel.send(language.noResult);
                });
                let wait = await waitimport(data.title, data.tracks.length, message);
                let m;
                if (wait) {
                    m = await message.channel.send(language.importPlaylist1.replace("${data.title}", data.title));
                    for (let i in data.tracks) {
                        await handleVideo(data.tracks[i], voiceChannel, true, serverQueue, "sc", message);
                        m.edit(language.importPlaylist2.replace("${data.tracks[i].title}", data.tracks[i].title).replace("${i}", i));
                    }
                }
                return m.edit(language.importPlaylistDone.replace("${data.title}", data.title));
            }
            if (url.match(scrxt)) {
                let data = await scdl.getInfo(url, scID).catch((err) => {
                    console.log(err);
                    throw message.channel.send(language.noResult);
                });
                await handleVideo(data, voiceChannel, true, serverQueue, "sc", message);
            }
            return;
        }

        if (!args[0]) return message.channel.send(language.noArgs);
        if (url.match(ytrx)) return processYoutubeLink(url);
        if (url.includes("open.spotify.com")) return processSpotifyLink(url);
        if (url.includes("soundcloud.com")) return processSoundcloudLink(url);

        let keyword = message.content.substr(message.content.indexOf(" ") + 1);
        message.channel.send(language.searching.replace("${keyword}", keyword));
        const videos = await ytsr.search(keyword);
        let menu = new disbut.MessageMenu()
            .setID(message.guild.id)
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder(language.choose);
        for (let i in videos) {
            let title = videos[i].title;
            let channel = videos[i].channel.name;
            let list = new disbut.MessageMenuOption()
                .setLabel(channel.length > 20 ? channel.slice(0, 20) + "..." : channel)
                .setValue(i)
                .setDescription(`${title.length > 35 ? title.slice(0, 30) + "..." : title} - ${videos[i].durationFormatted}`);
            menu.addOption(list);
        }

        let msg = await message.channel.send(language.choose, menu);
        let col = msg.createMenuCollector((b) => b.clicker.user.id === message.author.id && b.guild.id === message.guild.id,
            { time: 100000 }
        );
        col.on("collect", async (menu) => {
            await menu.reply.defer();
            handleVideo([videos[menu.values[0]]], voiceChannel, false, serverQueue, "yt", message);
            await menu.reply.delete();
            return;
        });
        col.on("end", (menu) => {
            if (!menu.first()) {
                msg.delete();
                msg.channel.send(language.timeout);
            }
        });
    },
};
