const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello Peeps.'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

const Discord = require('discord.js-selfbot-v13');
const { MessageEmbed, Message } = require('discord.js-selfbot-v13')
const client = new Discord.Client({
  checkUpdate: false
});

const chalk = require('chalk');
const winston = require('winston');

// Winston logging
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'antiCrashLog.log' }),
  ],
  format: winston.format.printf(log => `[${log.level.toLowerCase()}] - ${log.message}`),
});

process.on('unhandledRejection', (reason, p) => {
  logger.error(chalk.blueBright('[antiCrash.js]') + chalk.red('Unhandled rejection/crash detected.'));
  logger.error(reason.stack, p);
});
process.on("uncaughtException", (err, origin) => {
  logger.error(chalk.blueBright('[antiCrash.js]') + chalk.red('Uncaught exception/catch detected.'));
  logger.error(err.stack, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  logger.error(chalk.blueBright('[antiCrash.js]') + chalk.red('Uncaught exception/catch detected. (Monitor)'));
  logger.error(err.stack, origin);
});
process.on('multipleResolves', (type, promise, reason) => {
  logger.error(chalk.blueBright('[antiCrash.js]') + chalk.red('Multiple resolves detected.'));
  logger.error(type, promise, reason);
});



const { Database } = require("quickmongo");
const mongoURL = process.env['mongo']
const db = new Database(mongoURL);

const embed1 = new MessageEmbed().setTitle('You can bump again now!').setColor('RANDOM')
const emb2 = new MessageEmbed().setTitle('Thank you for bumping!').setDescription('You will be reminded again in 2 hours.').setColor('RANDOM')



async function bumpSys(client, db, options = []) {
  try {
    if (options.event === 'messageCreate') {
      let message = options.message
      if (message.author.id === '302050872383242240') {
        for (let i = 0; i < options.chid.length; i++) {
          if (message.channel.id === options.chid[i]) {
            if (
              message.embeds[0] &&
              message.embeds[0].description &&
              message.embeds[0].description.includes('Bump done')
            ) {
              let timeout = 7200000
              let time = Date.now() + timeout

              let setTime = db.set('bumpera-' + message.channel.id, time)

              const bumpoo = new Discord.MessageEmbed()
                .setTitle('Thank you')
                .setDescription(
                  'Thank you for bumping the server. Your support means a lot. Will notify you after 2 hours'
                )
                .setTimestamp()
                .setColor('#06bf00')
                .setFooter('Now its time to wait for 120 minutes. (2 hours)')
              //let chos = client.channels.cache.get('751436970286252104')
              //chos.send(options.bumpEmbed)
            }
          }
        }
      }
    } else if (options.event === 'ready') {
      setInterval(async () => {
        for (let i = 0; i < options.chid.length; i++) {
          let time = await db.fetch('bumpera-' + options.chid[i])

          if (time && time !== 'hia' && Date.now() > time) {
            db.set('bumpera-' + options.chid[i], 'hia')

            let cho = client.channels.cache.get('747780089151881258')

            const bumpo = new Discord.MessageEmbed()
              .setTitle('Its Bump Time !')
              .setDescription(
                'Its been 2 hours since last bump. Could someone please bump the server again ?'
              )
              .setTimestamp()
              .setColor('#075FFF')
              .setFooter('Do !d bump to bump the server')
            await cho.sendSlash('302050872383242240', 'bump')
            setTimeout(() => cho.send({ content: `<:KurumiSmug:1008727305998303402>` }), 1000)
            console.log('sus done')

          } else return
        }
      }, 1000)
    } else throw new Error('Unknown Event.. Please provide me a valid event..')
  } catch (err) {
    console.log(`Error Occured. | bumpSystem | Error: ${err.stack}`)
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('ready', () => {

  bumpSys(client, db, {
    event: "ready",
    chid: ["747780089151881258"],
    content: '!d bump',
    bumpEmbed: embed1,
    thanksEmbed: emb2
  });
})

client.on('messageCreate', function(message) {
  bumpSys(client, db, {
    event: "messageCreate",
    message: message,
    chid: ["747780089151881258"],
    bumpEmbed: embed1,
    thanksEmbed: emb2,
  })
});

client.on('messageCreate', async (msg) => {


  if (msg.author.id !== client.user.id) return;
  if (msg.content === 'ping') {
    msg.delete()
    msg.reply('pong');
  }

  if (msg.content === 'kitty') {
    msg.delete()
    const fetch = require('node-fetch');
    fetch('https://aws.random.cat/meow').then(response => response.json());
    const {
      file,
    } = await fetch('https://aws.random.cat/meow').then(response => response.json());

    const embed = new Discord.MessageEmbed()

      .setColor('RANDOM')
      .setDescription(`You're one cute little kitty.`)
      .setImage(file)
      .setTimestamp()
      .setFooter('♥');

    msg.channel.send(embed);
  }
});


client.login(process.env['token']);
