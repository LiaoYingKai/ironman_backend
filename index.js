const request = require('request')
const async = require('async')
const cheerio = require('cheerio')
var express = require('express')
var app = express()
var list = []
const PORT = process.env.PORT || 3000;

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
  'https://ithelp.ithome.com.tw/users/20112307/ironman/1954',
  'https://ithelp.ithome.com.tw/users/20112097/ironman/1858',
  'https://ithelp.ithome.com.tw/users/20112383/ironman/1976',
  'https://ithelp.ithome.com.tw/users/20112388/ironman/1978',
  'https://ithelp.ithome.com.tw/users/20111529/ironman/1985',
  'https://ithelp.ithome.com.tw/users/20112160/ironman/1988',
  'https://ithelp.ithome.com.tw/users/20112157/ironman/1999',
  'https://ithelp.ithome.com.tw/users/20112452/ironman/2002',
]
const contrastName = {
  jasonyangbanana: 'Jason',
  ken09326329: 'Kai',
  soj: 'soj',
  tedlee: 'Ted',
  lai0706: 'Lai',
  andyka1714: 'Andy',
  albert194: 'Albery',
  chris47: 'Chris',
  gg831006: 'Jeremy',
  serendipity: 'Ray',
  mangosu: 'Mango',
  henry97113: 'Henry',
  oklalala: 'TonyLin',
  leiadot: '日安',
  jjltainan: 'Lester',
  turtle0617: 'turtle',
  ttn: 'ttn',
  riverli: 'River',
  angel2248664: '小魚',
  mark9462: 'Jimmy',
  nathand: 'Nathan',
  jett: 'Jett',
}
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function(req, res) {
  async.map(ironmans, getInfo, (err, results) => {
    res.send(results);
    console.log(results)
  })
})
app.listen(PORT);

function getInfo(url, callback) {
  request(url, function(err, res, body) {
    var $ = cheerio.load(body)
    var link = url
    var name = $('.profile-header__name').text().trim()
    name = nameChange(name)
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

function nameChange(account) {
  let accountArray = account.split("")
  let name = []
  for (let i = (accountArray.indexOf("(") + 1); i < accountArray.indexOf(")"); i++) {
    name.push(accountArray[i])
  }
  name = name.join("")
  return contrastName[name]
}
// async.map(ironmans, getInfo, (err, results) => {
//   // res.send(results);
//   console.log(results)
// })


// console.log(contrastName)
//https://slack.com/api/users.list?token=xoxp-4772774963-383751005955-455053623381-01a5f8551542e462bd2525f7df91036e
//slack api
/*
curl -X POST \
--data-urlencode 'payload={"channel": "#fucking-kai", "username": "機器人", "text": "我來測試看看啦", "icon_emoji": ":bug:"}' \
https://hooks.slack.com/services/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
*/