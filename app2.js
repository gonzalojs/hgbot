var Xray = require('x-ray')
var x = Xray()
const Epub = require('epub-gen')



x('https://www.fanfiction.net/s/7750443/', '#content_wrapper_inner', [{
    title: 'b.xcontrast_txt',
    author: 'a:nth-child(5).xcontrast_txt',
    description: '#profile_top > div',
    info: 'span.xgray',
    body: 'div.storytext@html'
  }])
  .then((result) => {
    /*     console.log(result) */
    let numberOfChapters = 0
    let textChapters = []
    let paragraph = result[0].info.split(' - ')
    paragraph.map(chunk => {
      if (chunk.match(/Chapters:/g)) {
        let chapts = chunk.replace('Chapters: ', '')
        let numChapters = parseInt(chapts)
        numberOfChapters = numChapters
      } else {
        return
      }
    })

    for (let i = 1; i < (numberOfChapters + 1); i++) {
      x(`https://www.fanfiction.net/s/7750443/${i}/`, '#content_wrapper_inner', [{
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
            title: "Alice's Adventures in Wonderland",
            author: "Lewis Carroll",
            publisher: "Macmillan & Co.", // optional
            /* cover: "http://demo.com/url-to-cover-image.jpg", */ // Url or File path, both ok.
            content: textChapters
          };

          new Epub(option, './newepub.epub')
        })
    }

  })
  .catch((err) => {
    console.error(err)
  });

/*
No va a servir paginate porque no tiene direccion. No es un link, es un change location
Necesito hacer el scrape chapters numero de veces.
*/