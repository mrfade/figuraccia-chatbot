const tmi = require('tmi.js')
const sqlite3 = require('sqlite3').verbose()
require('dotenv').config()

const {
    getCommands,
    getCommand,
    addCommand,
    editCommand,
    removeCommand,
    logMessage
} = require('./utils')

const opts = {
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
    },
    channels: [
        process.env.CHANNEL_NAME
    ]
}

const client = new tmi.client(opts)

let db = new sqlite3.Database('./database.db')
let chatlogDb = new sqlite3.Database('./chatlog.db')

client.on('message', (target, context, msg, self) => {

    const channel = target
    const message = msg.trim()

    const datetime = (new Date()).toISOString()
    logMessage(chatlogDb, channel, context.username, JSON.stringify(context), message, datetime)

    if (self) return

    if (message.startsWith('!')) {

        const args = message.slice(1).split(' ')
        const command = args.shift().toLowerCase()

        if (context.mod || context.badges.broadcaster) {

            if (command === 'modcomms') {
                client.whisper(context.username, `!addcomm - Komut ekler, kullanım: !addcomm sa as
                !editcomm - Komutu düzenler, kullanım: !editcomm sa ashg
                !removecomm - Komutu siler, kullanım: !removecomm sa`)
            }

            if (command === 'allcomms') {
                getCommands(db, channel).then(rows => {
                    const commands = rows.map(row => {
                        return '!' + row.command
                    })
                    client.say(target, 'Komutlar: ' + commands.join(' '))
                }).catch(err => { })
            }

            if (command === 'addcomm') {
                const commandName = args.shift().toLowerCase()

                getCommand(db, channel, commandName).then(data => {
                    console.log('data', data)
                    client.say(target, 'Bu komut zaten mevcut.')
                }).catch(err => {
                    addCommand(db, channel, commandName, args.join(' ')).then(() => {
                        client.say(target, 'Komut başarıyla eklendi.')
                    }).catch(err => {
                        client.say(target, 'Komut eklenirken bir sorun oluştu.')
                    })
                })
            }

            if (command === 'editcomm') {
                const commandName = args.shift().toLowerCase()
                getCommand(db, channel, commandName).then(() => {
                    editCommand(db, channel, commandName, args.join(' ')).then(() => {
                        client.say(target, 'Komut başarıyla güncellendi.')
                    }).catch(err => {
                        client.say(target, 'Komut güncellenirken bir sorun oluştu.')
                    })
                }).catch(err => {
                    client.say(target, 'Komut bulunamadı.')
                })
            }

            if (command === 'removecomm') {
                const commandName = args.shift().toLowerCase()
                getCommand(db, channel, commandName).then(() => {
                    removeCommand(db, channel, commandName).then(() => {
                        client.say(target, 'Komut başarıyla silindi.')
                    }).catch(err => {
                        client.say(target, 'Komut silinirken bir sorun oluştu.')
                    })
                }).catch(err => {
                    client.say(target, 'Komut bulunamadı.')
                })
            }

        }

        getCommand(db, channel, command).then(data => {
            client.say(target, `@${context.username} ${data.response}`)
        }).catch(err => { })
    }

})

client.on('connected', (addr, port) => {
    console.log(`* Connected to ${addr}:${port}`)
})

client.connect()
