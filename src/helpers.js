const Snoowrap = require('snoowrap')
const {
  InboxStream,
  CommentStream,
  SubmissionStream
} = require('snoostorm')

require('dotenv').config()

const client = new Snoowrap({
  userAgent: 'web:https://github.com/gonzalojs:v0.0.1',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS
})

const BOT_START = Date.now() / 1000

const canSummon = (msg) => {
  return msg && msg.toLowerCase().includes('hgbotff(')
}

const comments = new CommentStream(client, {
  subreddit: 'testingground4bots',
  limit: 10,
  pollTime: 10000
})

exports.bot = {
  on: comments.on('item', (item) => {
    if (item.created_utc < BOT_START) return
    if (!canSummon(item.body)) return
    /*   console.log(item.body) */

    let newbody = item.body.split(' ')
    newbody.map(bit => {
      if (bit.match(/hgbotff/g)) {
        console.log(bit.trim())
      } else {
        return
      }
    })

    item.reply('hola mundo!')
  })
}