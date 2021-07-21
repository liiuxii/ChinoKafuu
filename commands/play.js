const ytdl = require('ytdl-core');
const ytsr = require('youtube-sr').default
const ytpl = require('ytpl');
const {
    PassThrough
} = require('stream')
const ffmpeg = require('fluent-ffmpeg');

const {
    scID
} = require('../config/config.json')
const scdl = require('soundcloud-downloader').default
const {
    Util,
    MessageEmbed,
} = require('discord.js');


const ytrx = new RegExp('(?:youtube\\.com.*(?:\\?|&)(?:v|list)=|youtube\\.com.*embed\\/|youtube\\.com.*v\\/|youtu\\.be\\/)((?!videoseries)[a-zA-Z0-9_-]*)');
const scrxt = new RegExp('^(?<track>https:\/\/soundcloud.com\/(?:(?!sets|stats|groups|upload|you|mobile|stream|messages|discover|notifications|terms-of-use|people|pages|jobs|settings|logout|charts|imprint|popular)(?:[a-z0-9\-_]{1,25}))\/(?:(?:(?!sets|playlist|stats|settings|logout|notifications|you|messages)(?:[a-z0-9\-_]{1,100}))(?:\/s\-[a-zA-Z0-9\-_]{1,10})?))(?:[a-z0-9\-\?=\/]*)$')
const sprxtrack = new RegExp('(http[s]?:\/\/)?(open.spotify.com)\/');

module.exports = {
    name: 'play',
    guildOnly: true,
    aliases: ['p'],
    description: 'Play a song based on a given url or a keyword',
    async execute(client, message, args) {

        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to play music!");

        const voiceChannel = message.member.voice.channel;
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.channel.send("I need the permissions to join and speak in your voice channel!");
        if (!args[0]) return message.channel.send("不要留白拉幹");
        let serverQueue = client.queue.get(message.guild.id);
        let url = args[0];

        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
                loop: false,
                filter: '',
            };
            await client.queue.set(message.guild.id, queueConstruct)
            serverQueue = client.queue.get(message.guild.id);
        }


        if (url.match(ytrx)) {
            if (ytsr.validate(url, 'PLAYLIST_ID')) {
                const playlist = await ytpl(url, {
                    'limit': Infinity
                })
                if (!playlist) return
                let result = await waitimport(playlist.title, playlist.estimatedItemCount)
                if (result) {
                    playlist.items.forEach(video => {
                        handleVideo(video, voiceChannel, true, serverQueue, 'ytlist');
                    });
                }
                return;
            } else {
                let videos = await ytsr.getVideo(args[0]);
                return handleVideo([videos], voiceChannel, false, serverQueue, 'yt')
            }
        }
        if (url.includes('open.spotify.com')) {
            url = 'spotify:' + url.replace(sprxtrack, '').replace('/', ':').replace('\?.*', '')
            if (url.startsWith('spotify:')) {
                let part = url.split(':')
                let Id = part[part.length - 1]
                let result
                if (part.includes('track')) {
                    result = await client.spotify.gettrack(Id)
                    let videos = await ytsr.search(result.artists[0].name + " " + result.name, {
                        limit: 1
                    })
                    return await handleVideo(videos, voiceChannel, false, serverQueue, 'yt')
                } else if (url.includes('album')) {
                    result = await client.spotify.getAlbum(Id)
                    let title = result.name
                    let m = await message.channel.send(`✅ Album: **${title}** importing`);
                    for (const i in result.tracks.items) {
                        console.log(result.artists[0].name + " " + result.tracks.items[i].name)
                        let videos = await ytsr.search(result.artists[0].name + " " + result.tracks.items[i].name, {
                            limit: 1
                        })
                        await handleVideo(videos, voiceChannel, true, serverQueue, 'yt')
                        m.edit(`✅ Album: **${videos[0].title}** importing **${i}**`);
                    }
                    return m.edit(`✅ Album: **${title}** has been added to the queue!`);
                } else if (url.includes('playlist')) {
                    result = await client.spotify.getplaylist(Id)

                    let title = result.name
                    let lenght = result.tracks.total

                    let wait = await waitimport(title, lenght)
                    if (wait == false) {
                        let videos = await ytsr.search(result.tracks.items[0].track.artists[0].name + " " + result.tracks.items[0].track.name, {
                            limit: 1
                        })
                        return await handleVideo(videos, voiceChannel, false, serverQueue, 'yt');
                    }

                    let m = await message.channel.send(`✅ Playlist: **${title}** importing`);
                    while (true) {
                        for (const i in result.tracks.items) {
                            let videos = await ytsr.search(result.tracks.items[i].track.artists[0].name + " " + result.tracks.items[i].track.name, {
                                limit: 1
                            })
                            await handleVideo(videos, voiceChannel, true, serverQueue, 'yt')
                            m.edit(`✅ PlayList: **${videos[0].title}** importing **${i}**`);
                        }
                        if (result.tracks.next == null) {
                            break;
                        } else {
                            result = await client.spotify._make_spotify_req(result.tracks.next)
                            continue;
                        }
                    }
                    return m.edit(`✅ Playlist: **${title}** has been added to the queue!`);
                }
            }
        }
        if (url.includes('soundcloud.com')) {
            if (scdl.isPlaylistURL(url)) {
                let data = await scdl.getSetInfo(url, scID)
                    .catch(err => {
                        console.log(err)
                        return message.channel.send('🆘 I could not obtain any search results.')
                    })
                let wait = await waitimport(data.title, data.tracks.length)
                if (wait) {
                    var m = await message.channel.send(`✅ Playlist: **${data.title}** importing`);
                    for (let i in data.tracks) {
                        await handleVideo(data.tracks[i], voiceChannel, true, serverQueue, 'sclist')
                        m.edit(`✅ Playlist: **${data.tracks[i].title}** importing **${i}**`);
                    }
                }
                return m.edit(`✅ Album: **${data.title}** has been added to the queue!`);
            }
            if (url.match(scrxt)) {
                let data = await scdl.getInfo(url, scID)
                    .catch(err => {
                        console.log(err)
                        throw message.channel.send('🆘 I could not obtain any search results.')
                    })
                await handleVideo(data, voiceChannel, true, serverQueue, 'sc')
            }
        }
        if (url.includes('www.bilibili.com')) {
            let id = await client.bilibili.getid(url);
            url = new URL(url);
            let p = url.searchParams.get('p') || 1;
            let data = await client.bilibili.getinfo(id);
            let durl = await client.bilibili.getlink(data.bvid, data.pages[p - 1].cid);
            if (data.pages[p - 1].part) {
                data.title = data.pages[p - 1].part
            }
            data.durl = durl.durl[0].url
            handleVideo(data, voiceChannel, false, serverQueue, 'bilibili');
        } else {
            let keyword = message.content.substr(message.content.indexOf(" ") + 1);
            message.channel.send(`Searching ${keyword}...`);
            const videos = await ytsr.search(keyword)
            let menu = new client.disbut.MessageMenu()
                .setID(message.guild.id)
                .setMinValues(1)
                .setMaxValues(1)
                .setPlaceholder('Chooose a song')
            for (let i in videos) {
                let title = videos[i].title
                let channel = videos[i].channel.name
                let list = new client.disbut.MessageMenuOption()
                    .setLabel(channel.length > 20 ? channel.slice(0, 20) + '...' : channel)
                    .setValue(i)
                    .setDescription(`${title.length > 35 ? title.slice(0,35) + '...' : title } - ${Math.floor((videos[i].duration / 1000) / 60) + ':' + ((videos[i].duration / 1000) - (Math.floor((videos[i].duration / 1000) / 60) * 60))}`);
                menu.addOption(list);
            }


            message.channel.send('請選擇歌曲', menu).then(msg => {
                let col = msg.createMenuCollector(b => b.clicker.user.id == message.author.id && b.guild.id == message.guild.id, {
                    time: 10000
                });
                col.on('collect',async(menu) => {
                        await menu.reply.defer();
                        handleVideo([videos[menu.values[0]]], voiceChannel, false, serverQueue, 'yt');
                        await menu.reply.delete()
                        return;
                })
                col.on('end', menu => {
                    if(!menu.first()){
                        msg.delete()
                        msg.channel.send("Timeout")
                    }
                })
            })

        }

        async function handleVideo(videos, voiceChannel, playlist = false, serverQueue, source) {
            let song
            switch (source) {
                case 'ytlist':
                    song = {
                        id: videos.id,
                        title: Util.escapeMarkdown(videos.title),
                        url: `https://www.youtube.com/watch?v=${videos.id}`,
                        requseter: message.member.id,
                        duration: videos.duration,
                        thumb: videos.thumbnails[0].url,
                        source: 'yt'
                    };
                    break;
                case 'yt':
                    song = {
                        id: videos[0].id,
                        title: Util.escapeMarkdown(videos[0].title),
                        url: videos[0].url,
                        requseter: message.member.id,
                        duration: Math.floor((videos[0].duration / 1000) / 60) + ':' + ((videos[0].duration / 1000) - (Math.floor((videos[0].duration / 1000) / 60) * 60)),
                        thumb: videos[0].thumbnail.url,
                        source: 'yt'
                    }
                    break;
                case 'sc':
                    song = {
                        id: videos.id,
                        title: Util.escapeMarkdown(videos.title),
                        url: videos.permalink_url,
                        requseter: message.member.id,
                        duration: Math.floor(videos.duration / 60) + ':' + (videos.duration - (Math.floor(videos.duration / 60) * 60)),
                        thumb: videos.artwork_url,
                        source: 'sc'
                    }
                    break;
                case 'sclist':
                    song = {
                        id: videos.id,
                        title: Util.escapeMarkdown(videos.title),
                        url: videos.permalink_url,
                        requseter: message.member.id,
                        duration: Math.floor(videos.duration / 60) + ':' + (videos.duration - (Math.floor(videos.duration / 60) * 60)),
                        thumb: videos.artwork_url,
                        source: 'sc'
                    }
                    break;
                case 'bilibili':
                    song = {
                        id: videos.bvid,
                        title: Util.escapeMarkdown(videos.title),
                        url: 'https://www.bilibili.com/video/' + videos.bvid,
                        requseter: message.member.id,
                        duration: Math.floor(videos.duration / 60) + ':' + (videos.duration - (Math.floor(videos.duration / 60) * 60)),
                        thumb: videos.pic,
                        durl: videos.durl,
                        source: 'bilibili'
                    }
                    break;
                default:
                    break;
            }
            if (!serverQueue.songs[0]) {
                try {
                    serverQueue.songs.push(song)
                    var connection = await voiceChannel.join();
                    serverQueue.connection = connection;
                    play(message.guild, serverQueue.songs[0], serverQueue);
                } catch (error) {
                    console.error(`I could not join the voice channel: ${error}`);
                    serverQueue.songs.length = 0
                    return message.channel.send(`I could not join the voice channel: ${error}`);
                }
            } else {
                serverQueue.songs.push(song)
                if (playlist) return;
                var embed = new MessageEmbed()
                    .setThumbnail(song.thumb)
                    .setAuthor("已加入播放佇列", message.author.displayAvatarURL())
                    .setColor("BLUE")
                    .setTitle(song.title)
                    .setURL(song.url)
                    .setTimestamp(Date.now())
                    .addField('播放者', `<@!${serverQueue.songs[0].requseter}>`)
                    .setFooter("音樂系統", client.user.displayAvatarURL());
                return message.channel.send(embed);
            }
        }

        async function play(guild, song) {
            let stream = new PassThrough({
                highWaterMark: 12
            })
            let proc
            if (!song) {
                serverQueue.voiceChannel.leave();
                client.queue.delete(guild.id)
                return;
            }
            switch (song.source) {
                case 'yt':
                    proc = new ffmpeg(ytdl(song.url, {
                        quality: 'highestaudio'
                    }))
                    break;
                case 'sc':
                    proc = new ffmpeg(await scdl.download(song.url, scID))
                    break;
                case 'bilibili':
                    proc = new ffmpeg(await client.bilibili.bdown(song.durl))
                    break;
                default:
                    proc = new ffmpeg(ytdl(song.url))
                    break;
            }

            proc.addOptions(['-ac', '2', '-f', 'opus', '-ar', '48000'])
            proc.on('error', function (err) {
                if (err == 'Output stream closed') return;
                console.log('an error happened: ' + err.message);
            })
            proc.writeToStream(stream, {
                end: true
            });
            const dispatcher = serverQueue.connection.play(stream, {
                    type: 'ogg/opus',
                    bitrate: 'auto'
                })
                .on('finish', reason => {
                    if (reason === 'Stream is not generating quickly enough.') console.log('Stream is not generating quickly enough.');
                    console.log(reason)
                    if (!serverQueue.loop) {
                        serverQueue.songs.shift()
                    }
                    stream.destroy()
                    play(guild, serverQueue.songs[0], serverQueue);
                })
                .on('error', error => {
                    message.channel.send('An error happened!')
                    console.log(error)
                })
            dispatcher.setVolumeDecibels(1);            ;
            var embed = new MessageEmbed()
                .setThumbnail(song.thumb)
                .setAuthor("開始撥放", message.author.displayAvatarURL())
                .setColor("BLUE")
                .setTitle(song.title)
                .setURL(song.url)
                .setTimestamp(Date.now())
                .addField('播放者', `<@!${serverQueue.songs[0].requseter}>`)
                .setFooter("音樂系統", client.user.displayAvatarURL());
            serverQueue.textChannel.send(embed);

        }

        async function waitimport(name, length) {
            return new Promise((resolve, reject) => {
                let embed = new MessageEmbed()
                    .setAuthor("清單", message.author.displayAvatarURL())
                    .setColor("BLUE")
                    .setTitle("您要加入這個清單嗎")
                    .setDescription(`清單: ${name}\n長度:${length}`)
                    .setTimestamp(Date.now())
                    .setFooter("音樂系統", client.user.displayAvatarURL());
                message.channel.send(embed).then(async m => {
                    await m.react('📥');
                    await m.react('❌');
                    let filter = (reaction, user) => {
                        if (user.id == message.author.id) {
                            if (reaction.emoji.name === '📥') {
                                return true
                            }
                            if (reaction.emoji.name === '❌') {
                                return true
                            }
                        }
                    }
                    m.awaitReactions(filter, {
                            maxEmojis: 1,
                            time: 10000
                        })
                        .then(collected => {
                            if (!collected.first()) {
                                return;
                            }
                            if (collected.first().emoji.name == '📥') {
                                let embed = new MessageEmbed()
                                    .setAuthor("清單", message.author.displayAvatarURL())
                                    .setColor("BLUE")
                                    .setTitle("您加入了清單")
                                    .setDescription(`清單: ${name}`)
                                    .setTimestamp(Date.now())
                                    .setFooter("音樂系統", client.user.displayAvatarURL());
                                m.edit(embed)
                                return resolve(true)
                            }
                            if (collected.first().emoji.name == '❌') {
                                let embed = new MessageEmbed()
                                    .setAuthor("清單", message.author.displayAvatarURL())
                                    .setColor("BLUE")
                                    .setTitle("您取消了加入清單")
                                    .setDescription(`清單: ${name}`)
                                    .setTimestamp(Date.now())
                                    .setFooter("音樂系統", client.user.displayAvatarURL());
                                m.edit(embed)
                                return reject(false)
                            }
                        }).catch(err => {
                            console.log(err)
                            reject(false)
                        })
                });
            })
        }
    },
};