var Xray = require('x-ray')
var x = Xray()

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
      .then(capitulos => {
        console.log(i)
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