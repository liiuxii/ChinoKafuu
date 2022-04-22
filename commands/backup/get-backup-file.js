const { reply } = require('../../functions/commandReply.js');
const fs = require('fs');

async function getBackupFile(command, args, language) {
    const backupID = args[0];
    if (!backupID) return reply(command, language.invalidBackupID, 'RED');
    if (!fs.existsSync(`./my-backups/${backupID}.json`)) return reply(command, language.noBackupFound.replace('${backupID}', backupID), 'RED');
    return reply(command, { content: `Backup file ID: \`${backupID}\``, files: ['./my-backups/${backupID}.json'] });
}

module.exports = {
    name: 'get-backup-file',
    cooldown: 10,
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    description: {
        'en_US': 'Load a server backup based on backup ID.',
        'zh_CN': '根据ID加载备份文件',
        'zh_TW': '根據ID加載備份文件',
    },
    options: [
        {
            name: 'id',
            description: {
                'en_US': 'Backup ID',
                'zh_CN': '备份ID',
                'zh_TW': '備份ID0',
            },
            type: 'INTEGER',
            required: true,
        },
    ],
    async execute(message, args, language) {
        await getBackupFile(message, args, language);
    },
    slashCommand: {
        async execute(interaction, language) {
            await getBackupFile(interaction, [interaction.options.getInteger('id')], language);
        },
    },
};
