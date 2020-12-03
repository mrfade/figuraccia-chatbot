function getCommands(db, channel) {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM commands WHERE channel = ?", [channel], (err, rows) => {
            if (err || rows === undefined) reject(err)
            resolve(rows)
        })
    })
}

function getCommand(db, channel, commandName) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM commands WHERE channel = ? AND command = ?", [channel, commandName], (err, row) => {
            if (err || row === undefined) reject(err)
            resolve(row)
        })
    })
}

function addCommand(db, channel, commandName, response) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO commands(channel, command, response) VALUES(?, ?, ?)`, [channel, commandName, response], function (err) {
            if (err) reject(err)
            resolve(true)
        })
    })
}

function editCommand(db, channel, commandName, response) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE commands SET response = ? WHERE channel = ? AND command = ?`, [response, channel, commandName], function (err) {
            if (err) reject(err)
            resolve(true)
        })
    })
}

function removeCommand(db, channel, commandName) {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM commands WHERE channel = ? AND command = ?`, [channel, commandName], function (err) {
            if (err) reject(err)
            resolve(true)
        })
    })
}

function logMessage(db, channel, username, state, message, datetime) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO chatlog(channel, username, state, message, datetime) VALUES(?, ?, ?, ?, ?)`, [channel, username, state, message, datetime], function (err) {
            if (err) reject(err)
            resolve(true)
        })
    })
}

module.exports = {
    getCommands,
    getCommand,
    addCommand,
    editCommand,
    removeCommand,
    logMessage
}