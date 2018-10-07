const request = require('request')
const async = require('async')
const cheerio = require('cheerio')
var express = require('express')
var app = express()
var list = []

const ironmans = [
  'https://ithelp.ithome.com.tw/users/20107705/ironman/1898',
  'https://ithelp.ithome.com.tw/users/20111772/ironman/1902',
  'https://ithelp.ithome.com.tw/users/20107697/ironman/1900',
  'https://ithelp.ithome.com.tw/users/20107700/ironman/1901',
  'https://ithelp.ithome.com.tw/users/20111959/ironman/1786',
  'https://ithelp.ithome.com.tw/users/20107702/ironman/1904',
  'https://ithelp.ithome.com.tw/users/20110801/ironman/1899',
  'https://ithelp.ithome.com.tw/users/20107637/ironman/1927',
  'https://ithelp.ithome.com.tw/users/20107701/ironman/1785',
  'https://ithelp.ithome.com.tw/users/20112161/ironman/1905',
  'https://ithelp.ithome.com.tw/users/20112158/ironman/1914',
  'https://ithelp.ithome.com.tw/users/20110055/ironman/1920',
  'https://ithelp.ithome.com.tw/users/20112096/ironman/1857',
  'https://ithelp.ithome.com.tw/users/20103075/ironman/1921',
]

// app.get('/', function(req, res) {
//   async.map(ironmans, getIndo, (err, results) => {
//     res.send(results);
//   })
// })

async.map(ironmans, getInfo, (err, results) => {
  console.log(results)
  list = results
})

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function(req, res) {
  res.send(list)
})
app.listen(3000)

function getInfo(url, callback) {
  request(url, function(err, res, body) {
    var $ = cheerio.load(body)
    var link = url
    var name = $('.profile-header__name').text().trim()
    var title = $('.qa-list__title--ironman').text().trim().replace(' 系列', '')
    var joinDays = $('.qa-list__info--ironman span').eq(0).text().replace(/[^0-9]/g, '')
    var posts = $('.qa-list__info--ironman span').eq(1).text().replace(/[^0-9]/g, '')
    var subscriber = $('.qa-list__info--ironman span').eq(2).text().replace(/[^0-9]/g, '')
    var cumulativeView = $('.profile-header__view-num').eq(0).text().replace(/[^0-9]/g, '')
    var followers = $('.profile-header__follow-num').eq(0).text().replace(/[^0-9]/g, '')
    // var postList = $('.qa-list').map((index, obj) => {
    //   return {
    //     title: $(obj).find('.qa-list__title').text().trim(),
    //     like: $(obj).find('.qa-condition__count').eq(0).text().trim(),
    //     comment: $(obj).find('.qa-condition__count').eq(1).text().trim(),
    //     view: $(obj).find('.qa-condition__count').eq(2).text().trim(),
    //     date: $(obj).find('.qa-list__info-time').text().trim(),
    //     url: $(obj).find('.qa-list__title a').attr('href').trim(),
    //   }
    // }).get()

    callback(null, {
      name,
      title,
      link,
      joinDays,
      posts,
      subscriber,
      cumulativeView,
      followers,
      // postList
    });
  })
}