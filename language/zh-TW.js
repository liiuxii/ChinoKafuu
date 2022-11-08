/* eslint quotes: 0 */
module.exports = {
    "backup": {
        "invalidBackupID": "您必須輸入有效的備份文件ID！",
        "backupInformation": "備份信息",
        "backupID": "備份文件ID",
        "serverID": "伺服器ID",
        "backupSize": "文件大小",
        "backupCreatedAt": "創建於",
        "noBackupFound": "找不到\\`${backupID}\\`這個ID！",
        "notAdmin": "你必須是伺服器管理員才能請求備份！",
        "startBackup": "開始備份...\n頻道最大備份訊息量: ${max}\n圖片格式: base64",
        "doneBackupDM": "✅ | 備份已創建! 要加載備份, 請在目標伺服器中輸入此指令: \\`${prefix}load ${backupData.id}\\`!",
        "doneBackupGuild": "備份已創建。備份ID已發送至私訊！",
        "warningBackup": "加載備份後, 所有的原本的頻道，身分組等將無法復原！ 輸入 `-confirm` 確認!",
        "timesUpBackup": "時間到! 已取消備份加載!",
        "startLoadingBackup": "✅ | 開始加載備份!",
        "backupError": "🆘 | 很抱歉，出了點問題... 請檢查我有沒有管理員權限!",
        "doneLoading": "✅ | 群組備份完成！",
        "outOfRange": "頻道最大備份訊息數不能小於0或大於1000！",
    },
    "8ball": {
        "noQuestion": "你要問問題啦幹",
        "reply1": "這是必然",
        "reply2": "肯定是的",
        "reply3": "不用懷疑",
        "reply4": "毫無疑問",
        "reply5": "你能相信它",
        "reply6": "如我所見，是的",
        "reply7": "很有可能",
        "reply8": "看起来很好",
        "reply9": "是的",
        "reply10": "種種跡象指出「是的」",
        "reply11": "回覆攏統，再試試",
        "reply12": "待會再問",
        "reply13": "最好現在不告訴你",
        "reply14": "現在無法預測",
        "reply15": "專心再問一遍",
        "reply16": "想的美",
        "reply17": "我的回覆是「不」",
        "reply18": "我的來源說「不」",
        "reply19": "看起来不太好",
        "reply20": "很可疑",
        "reply": "神奇八號球 🎱 回答:",
    },
    "connect4": {
        "board": "現在輪到 ${round.name}!\n${boardStr}",
        "invalidMove": "你不能往那邊放棋子！",
        "win": "${round.name} 贏了!",
    },
    "loli": {
        "noToken": "没有pixiv refreshToken不能使用這個指令！",
    },
    "pixiv": {
        "noToken": "沒有pixiv refreshToken不能使用這個指令！",
        "noIllust": "這個畫作不存在！",
        "noUser": "這個用戶不存在！",
        "noResult": "沒有找到結果！",
        "unknownSubcommand": "無效的子指令！",
    },
    "updateIllust": {
        "noToken": "沒有pixiv refreshToken不能使用這個指令！",
    },
    "yt-together": {
        "notInVC": "加入語音頻道後才能使用此指令！",
    },
    "anime": {
        "similarity": "相似度: ${similarity}%",
        "sourceURL": "**來源鏈接**",
        "nativeTitle": "日語標題",
        "romajiTitle": "羅馬音標題",
        "englishTitle": "英語標題",
        "episode": "集數",
        "NSFW": "NSFW",
        "invalidURL": "請輸入正確的網址!",
        "noImage": "你要先上傳一張圖片才能使用這個指令!",
    },
    "avatar": {
        "yourAvatar": "__你的頭像__",
        "userAvatar": "__${user.username}的頭像__",
        "memberAvatar": "__${user.displayName}的頭像__",
        "noMember": "找不到匹配 \\`${keyword}\\` 的用戶!",
    },
    "google": {
    },
    "help": {
        "helpTitle": "指令列表",
        "helpPrompt": "這是我所有的指令:",
        "helpPrompt2": "\n你可以發送 \\`${prefix}help [command name]\\` 來查詢指令詳情!",
        "helpSend": "我已經把我的指令列表私訊給你了！",
        "invalidCmd": "該指令不存在!",
        "cmdName": "**名字:**",
        "cmdAliases": "**別名:**",
        "cmdDescription": "**描述:**",
        "cmdUsage": "**用法:**",
        "cmdCoolDown": "**冷卻:**",
    },
    "invite": {
        "invite": "邀請我！",
    },
    "run": {
        "invalidUsage": "無效用法！ 無效的語言/代碼。",
        "wait": "請稍等...",
        "usage": "用法: c!run <語言> [代碼](有無代碼塊皆可)",
        "notSupported": "不支持該語言！",
        "outputTooLong": "輸出過長 (超過2000個字符/40行)，所以我把它上傳到了這裡： ${link}",
        "postError": "輸出太長了， 但是我無法將輸出上傳到網站上。",
        "noOutput": "沒有輸出！",
    },
    "sauce": {
        "similarity": "相似度: ${similarity}%",
        "sourceURL": "**來源鏈接**",
        "searchingSauce": "正在搜索圖片...",
        "additionalInfo": "額外信息",
        "noAuthor": "找不到作者信息！",
        "sauceAuthor": "名字: ${authorInfo.name}\n鏈接: ${authorInfo.url}",
        "title":"標題",
        "author":"作者",
    },
    "server": {
        "serverInfo": "伺服器資料",
        "serverName": "伺服器名字",
        "serverOwner": "伺服器擁有者",
        "memberCount": "伺服器人數",
        "serverRegion": "伺服器區域",
        "highestRole": "最高身份組",
        "serverCreatedAt": "伺服器創造時間",
        "channelCount": "伺服器頻道數",
    },
    "user-info": {
        "customStatus": "__自定義活動__\n<:${name}:${id}> ${state}\n",
        "gameStatus": "__${type}__\n${name}\n${details}",
        "notPlaying": "用戶沒在玩遊戲",
        "uiTitle": "用戶資料",
        "tag": "Tag",
        "nickname": "昵稱",
        "id": "ID",
        "avatarURL": "頭像",
        "avatarValue": "[點我](${url})",
        "createdAt": "賬戶創造時間",
        "joinedAt": "加入伺服器時間",
        "activity": "活動",
        "none": "無",
        "status": "狀態",
        "device": "設備",
        "roles": "身分組(${author.roles.cache.size})",
    },
    "ban": {
        "noMention": ":x: | 你要提及一個人才能對他停權！",
        "cantBanSelf": "你不能對你自己停權啦",
        "cannotBan": "不能對這個人停權",
        "banSuccess": "成功對 ${taggedUser.user.username}停權！",
    },
    "kick": {
        "noMention": ":warning: | 你要提及一個人才能踢出他！",
        "cantKickSelf": ":x: | 你不能踢出你自己啦",
        "cannotKick": "不能踢出這個人！",
        "kickSuccess": "成功踢出 ${taggedUser.user.username}！",
    },
    "prune": {
        "invalidNum": "這看起來不像是有效的數字！",
        "notInRange": "請輸入1到99之間的數字！",
        "pruneError": "在嘗試刪除訊息時發生了錯誤!",
    },
    "clear": {
        "cleared": "播放清單已清除！",
    },
    "loop": {
        "on": "循環模式開啟！",
        "off": "循環模式關閉！",
    },
    "loop-queue": {
        "on": "清單循環模式開啟！",
        "off": "清單循環模式關閉！",
    },
    "lyric": {
        "searching": ":mag: | 正在搜尋 ${keyword}...",
        "noLyricsFound": ":x: | 找不到 `${keyword}` 的歌詞！",
        "title": "`${keyword}` 的歌詞",
        "noKeyword": "沒有提供關鍵詞！",
    },
    "now-playing": {
        "npTitle": "**正在播放 ♪**",
        "requester": "請求者:",
        "musicFooter": "音樂系統",
    },
    "pause": {
        "pause": "已暫停！",
    },
    "play": {
        "notInVC": "加入語音頻道後才能使用此指令！",
        "cantJoinVC": "我需要加入頻道和說話的權限!",
        "importAlbum1": "✅ | 專輯: **${title}** 導入中",
        "importAlbum2": "✅ | 專輯: **${videos[0].title}** 導入中 **${i}**",
        "importAlbumDone": "✅ | 專輯: **${title}** 已加入到播放清單!",
        "importPlaylist1": "✅ | 播放列表: **${title}** 導入中",
        "importPlaylist2": "✅ | 播放列表: **${videos[0].title}** 導入中 **${i}**",
        "importPlaylistDone": "✅ | 播放列表: **${title}** 已加入到播放清單!",
        "noResult": "我找不到任何搜尋結果！",
        "noArgs": "不要留白拉幹",
        "searching": "🔍 | 正在搜索 ${keyword}...",
        "choose": "請選擇歌曲",
        "timeout": "時間到！",
    },
    "queue": {
        "queueTitle": "播放清單",
        "queueBody": "**正在播放**\n[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})\n\n**在清單中**\n${printQueue}\n${serverQueue.songs.length - 1} 首歌",
    },
    "related": {
        "relatedSearch": "🔍 | 正在搜尋相關歌曲...",
        "noResult": "我找不到任何搜尋結果！",
    },
    "remove": {
        "removed": "已移除 ${serverQueue.songs[queuenum].title}!",
        "invalidInt": "請輸入有效的數字!",
    },
    "resume": {
        "playing": "我已經在播放了！",
        "resume": "繼續播放！",
    },
    "skip": {
        "skipped": "已跳過歌曲",
    },
    "stop": {
        "stopped": "已停止播放",
    },
    "set": {
        "languageNotSupported": "不支持該語言！",
        "changeSuccess": "成功更換語言至`${args[0]}`！",
        "argsNotChannel": "沒有提供頻道！",
        "argsNotRole": "沒有提供身份組！",
        "argsNotNumber": "沒有提供數字！",
        "noRole": "沒有提供身份組！",
        "logChannelChanged": "記錄頻道調整至 ${args[0]}！",
        "starboardChanged": "名句精華調整至 ${args[0]}！",
        "levelRewardAdded": "成功添加身份組獎勵: ${args[0]} => ${args[1]}！",
        "levelRewardRemoved": "成功移除身份組獎勵: ${args[0]} => ${args[1]}！",
    },
    "cemoji": {
        "noEmoji": "請告訴我要復製哪個表情！",
        "addSuccess": "表情 \\`${emoji.name}\\` ${emoji} 已被加入到伺服器中！",
    },
    "edit-snipe": {
        "exceed10": "不能超過10！",
        "invalidSnipe": "無效狙擊！",
        "noSnipe": "沒有能狙擊的訊息！",
    },
    "snipe": {
        "exceed10": "不能超過10！",
        "invalidSnipe": "無效狙擊！",
        "noSnipe": "沒有能狙擊的訊息！",
    },
    "ping": {
        "pinging": "Pinging...",
        "heartbeat": "Websocket 心跳：",
        "latency": "往返延遲：",
    },
};