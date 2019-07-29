const download = require('./index');
const fs = require('fs');

const url = 'http://pic37.nipic.com/20140113/8800276_184927469000_2.png';

const urls = [
  'http://imglf4.nosdn.127.net/img/dmVPYUJCN2NpNVVkK2ExRCtoZ1AyYXE0cEh4RVhiUWk4OHVqb3Q5Y1BlMU5WQThZTmR4Ry9RPT0.jpg?imageView&thumbnail=96x96&quality=90&type=jpg',
  'http://imglf2.nosdn.127.net/img/dmVPYUJCN2NpNVhCUUxQdDQvSE5vVHpWYktQVEx5S0NhR1piTTFoZjFOZElsK0VCaXR2Q3lRPT0.jpg?imageView&thumbnail=1680x0&quality=96&stripmeta=0&type=jpg',
  'http://imglf2.nosdn.127.net/img/dmVPYUJCN2NpNVZCY3ZkS3Fwa1kzUUNFYndTRFBaWkpMZ0pvRDNIWkI4M1A4M0g2RWVpTUN3PT0.jpg?imageView&thumbnail=1680x0&quality=96&stripmeta=0&type=jpg',
  'http://imglf1.nosdn.127.net/img/dmVPYUJCN2NpNVVXVUpWbzB5dzZOUUN0VUJSWE9qRnpZT1pOb3JBU0gyeWlpb1l4TkFHUXRBPT0.jpg?imageView&thumbnail=1680x0&quality=96&stripmeta=0&type=jpg',
];

// // pipe
// download(url)
//   .pipe(fs.createWriteStream('test.jpg'));

// // promise
// download(url)
//   .then(data => fs.writeFile('test.jpg', data, err => {}));

// multiple download task
(async () => {
  for (let i = 0; i < urls.length; i++) {
    await download(urls[i], 'dist');
  }
  console.log('files downloaded!');
})();

// // file type: html
// download('https://www.baidu.com', 'dist');

// // file type: jpg
// download(url, 'dist');

// // file type: gif
// download('https://f.sinaimg.cn/tech/transform/598/w326h272/20190716/7f83-hzuhxyq1725988.gif', 'dist');

// // file type: js
// download('https://cdn.bootcss.com/jquery/3.4.1/core.js', 'dist');

// // request error
// download('https://cartodb-basemaps-d.global.ssl.fastly.net/light_all/8/208/107.png', 'dist', { request: { timeout: 5000 } })
//   .then(() => {
//     console.log('error')
//   });

// // request error
// download('http://test.xy', 'dist');
