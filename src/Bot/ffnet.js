var Xray = require('x-ray')
var x = Xray()
const Epub = require('epub-gen')
let numberOfChapters = 0
let titleBook = null
let author = null
let textChapters = []
let url = 'https://www.fanfiction.net/s/'

exports.ffnet = {

  get: (id) => {
    x(`https://www.fanfiction.net/s/${id}`, '#content_wrapper_inner', [{
        title: 'b.xcontrast_txt',
        author: 'a:nth-child(5).xcontrast_txt',
        description: '#profile_top > div',
        info: 'span.xgray',
        body: 'div.storytext@html'
      }])
      .then((result) => {
        /*     console.log(result) */
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

        for (let i = 1; i < (numberOfChapters + 1); i++) {
          x(`https://www.fanfiction.net/s/${id}/${i}/`, '#content_wrapper_inner', [{
              body: 'div.storytext@html'
            }])
            .then(capitulo => {
              ch = {
                data: capitulo[0].body
              }
              textChapters[i - 1] = ch
            })
            .then(() => {
              /* console.log(textChapters) */ //funcionando
              const option = {
                title: titleBook,
                author: author,
                publisher: "Fanfiction.net", // optional
                cover: "https://66.media.tumblr.com/b1f728687cd0df45d95837b44df38f6a/tumblr_pmthfoTLQW1qg1e00o1_1280.png", // Url or File path, both ok.
                content: textChapters
              };

              new Epub(option, `src/ebooks/${titleBook}.epub`)
                .catch(missing => {
                  console.log(missing)
                })
            })
        }

      })
      .catch((err) => {
        console.error(err)
      });
  }
}