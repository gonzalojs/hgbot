require('dotenv').config()
const Snoowrap = require('snoowrap')
const {
  InboxStream,
  CommentStream,
  SubmissionStream
} = require('snoostorm')

const client = new Snoowrap({
  userAgent: 'harr-ginny-fanfiction-bot',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS
})

const BOT_START = Date.now() / 1000

const canSummon = (msg) => {
  return msg && msg.toLowerCase().includes('/u/hgbot')
}

const comments = new CommentStream(client, {
  subreddit: 'testingground4bots',
  limit: 10,
  pollTime: 10000
})
comments.on('item', (item) => {
  if (item.created_utc < BOT_START) return
  if (!canSummon(item.body)) return
  console.log(item)
  item.reply('hola mundo!')
})