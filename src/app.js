const express = require('express');
const app = express()
const path = require('path')
const morgan = require('morgan');
const bodyParser = require('body-parser')
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

// check for botname
const canSummon = (msg) => {
  return msg && msg.toLowerCase().includes('hgbotff(')
}

const comments = new CommentStream(client, {
  subreddit: 'testingground4bots',
  limit: 10,
  pollTime: 10000
})

comments.on('item', (item) => {
  if (item.created_utc < BOT_START) return
  if (!canSummon(item.body)) return
/*   console.log(item.body) */

  let newbody = item.body.split(' ')
  newbody.map(bit => {
    if(bit.match(/hgbotff/g)) {
      console.log(bit.trim())
    } else {
      return
    }
  })

  item.reply('hola mundo!')
})


app.use(express.static('src/public'))
app.use(morgan('dev'))
app.use(bodyParser.json({
  limit: '5mb'
}))
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '5mb',
  parameterLimit: 100000
}))
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))

//cors. Evitar CORS errors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

// TODO aqui van los routes
/* app.use('/dev', require('./routes/Test.routes')) */

//error handling, tiene que ir luego de los rew que funcionan
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app