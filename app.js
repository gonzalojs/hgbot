require('dotenv').config()
const Snoowrap = require('snoowrap')
const { InboxStream, CommentStream, SubmissionStream } = require('snoostorm')

const client = new Snoowrap({
  userAgent: 'reddit-bot-example-node',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS
})

const comments = new CommentStream(client, {
  subreddit: 'news',
  limit: 100,
  pollTime: 2000
})
comments.on('item', console.log)