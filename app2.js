var Xray = require('x-ray')
var x = Xray()

x('https://www.fanfiction.net/s/7750443/1/Marauders-Growing-Up', '#content_wrapper_inner', [
  {
    title: 'b.xcontrast_txt',
    author: 'a:nth-child(5).xcontrast_txt',
    description: '#profile_top > div',
    info: 'span.xgray'
/*     link: '.btn ' */
  }
])
.then((result) => {
  let paragraph = result[0].info.split(' - ')
  paragraph.map(chunk => {
    if (chunk.match( /Chapters:/g )) {
      let chapts = chunk.replace('Chapters: ', '')
      console.log(parseInt(chapts))
    } else {
      return
    }
  })
}).catch((err) => {
  console.error(err)
});