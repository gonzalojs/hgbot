const Snoowrap = require('snoowrap')
const {
  InboxStream,
  CommentStream,
  SubmissionStream
} = require('snoostorm')
const ffn = require('./ffnet')
const throttledQueue = require('throttled-queue')
const throttle = throttledQueue(1, 2000)
var Xray = require('x-ray')
var x = Xray()
const Epub = require('epub-gen')


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
            /* console.log(ffn.ffnet.get(book_number)) */
            function get() {

              let numberOfChapters = 0
              let titleBook = null
              let author = null
              let url = 'https://www.fanfiction.net/s/'
              let textChapters = []

              x(`${url}${book_number}`, '#content_wrapper_inner', [{
                  title: 'b.xcontrast_txt',
                  author: 'a:nth-child(5).xcontrast_txt',
                  description: '#profile_top > div',
                  info: 'span.xgray',
                  body: 'div.storytext@html'
                }])
                .then((result) => {
                  titleBook = result[0].title
                  author = result[0].author


                  let paragraph = result[0].info.split(' - ')
                  paragraph.map(chunk => {
                    if (chunk.match(/Chapters:/g)) {
                      let chapts = chunk.replace('Chapters: ', '')
                      let numChapters = parseInt(chapts)
                      numberOfChapters = numChapters
                      return
                    }

                    return

                  })
                })
                .then(() => {
                  let numeral = 0

                  for (let i = 1; i < (numberOfChapters + 1); i++) {
                    x(`https://www.fanfiction.net/s/${book_number}/${i}/`, '#content_wrapper_inner', [{
                        body: 'div.storytext@html'
                      }])
                      .then(capitulo => {
                        ch = {
                          data: capitulo[0].body
                        }
                        textChapters[i - 1] = ch
                        numeral += 1

                        if (numeral == numberOfChapters) {
                          const option = {
                            title: titleBook,
                            author: author,
                            publisher: "Fanfiction.net", // optional
                            cover: "https://66.media.tumblr.com/b1f728687cd0df45d95837b44df38f6a/tumblr_pmthfoTLQW1qg1e00o1_1280.png", // Url or File path, both ok.
                            content: textChapters
                          };
                          new Epub(option, `src/ebooks/${titleBook}.epub`)

                          function post() {
                            item.reply(titleBook)
                              .then((success) => {
                                console.log('se pudo')
                              }).catch((err) => {
                                console.log('de nuevo')
                                setTimeout(post, 60000)
                              });
                          }

                          post()
                        }
                      })
                  }
                })
                .catch((err) => {
                  console.error(err)
                });
            }
            get()

            return
          } else {
            return
          }
        } else {
          return
        }
      });
    })
  })
}