module.exports = {
  apps: [
    {
      name: 'figuraccia-chatbot',
      exec_mode: 'fork',
      instances: 1,
      script: '/usr/bin/npm',
      args: 'start'
    }
  ]
}
