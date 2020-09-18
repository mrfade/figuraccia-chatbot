const tmi = require('tmi.js')
require('dotenv').config()

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

const commands = [
    {
        condition: c => c === '!komutlar',
        response: (ctx, msg) => `@${ctx.username} !yaş - !boy - !diller - !okul`
    },
    {
        condition: c => c === '!okul' || c === '!bölüm' || c.includes('hangi okul') || c.includes('hangi bölüm') || c.includes('okul bölüm') || c.includes('okul ve bölüm'),
        response: (ctx, msg) => `@${ctx.username} Amerika veya Kanada'da İşletme ve Uluslararası İlişkiler okumak istiyorum.`
    },
    {
        condition: c => c === '!yaş' || c.includes(' yaş '),
        response: (ctx, msg) => `@${ctx.username} 18`
    },
    {
        condition: c => c === '!boy',
        response: (ctx, msg) => `@${ctx.username} 1.76`
    },
    {
        condition: c => c === '!diller' || c.includes('kaç dil'),
        response: (ctx, msg) => `@${ctx.username} Türkçe, İngilizce, Fransızca, İtalyanca`
    },
    {
        condition: c => c === '!languages',
        response: (ctx, msg) => `@${ctx.username} Turkish, English, French, Italian`
    },
    {
        condition: c => c.includes('evlimisin') || c.includes('evli misin'),
        response: (ctx, msg) => `@${ctx.username} değilim, okul yüzüğüm.`
    },
]

client.on('message', (target, context, msg, self) => {
    if (self) return

    const commandName = msg.trim()

    for (const command of commands) {
        if (command.condition(commandName)) {
            client.say(target, command.response(context, msg))
            break
        }
    }

})

client.on('connected', (addr, port) => {
    console.log(`* Connected to ${addr}:${port}`)
})

client.connect()
