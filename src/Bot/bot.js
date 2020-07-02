const Snoowrap = require('snoowrap')
const {
  InboxStream,
  CommentStream,
  SubmissionStream
} = require('snoostorm')
const ffn = require('./ffnet')
const throttledQueue = require('throttled-queue')
const throttle = throttledQueue(1, 20000)

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

exports.orders = {
  on: comments.on('item', (item) => {
    if (item.created_utc < BOT_START) return
    if (!canSummon(item.body)) return
    /*   console.log(item.body) */

    let newbody = item.body.split(' ')
    newbody.map(bit => {

      throttle(function () {
        // perform some type of activity in here.
        if (bit.match(/hgbotff/g)) {
          let book = bit.trim()
          let book_clean = book.replace('hgbotff(', '')
          let book_cleanest = book_clean.replace(')', '')
          let book_number = parseInt(book_cleanest)
          console.log(book_number)
          if (!isNaN(book_number)) {
            let fanfictionName = ffn.ffnet.get(book_number)
           /*  console.log(fanfictionName) */
            return
          } else {
            return
          }

        } else {
          return
        }
      });
    })
/*     item.reply('hola mundo!') */
  })
}