const request = require('request')
const async = require('async')
const cheerio = require('cheerio')
const Slack = require('slack-node')
const moment = require('moment')
var express = require('express')
var app = express()
var isNotPost = []

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
const contrastList = [{
    account: 'jasonyangbanana',
    name: 'Jason',
    real_name: 'Jason Yang'
  }, {
    account: 'ken09326329',
    name: 'Kai',
    real_name: 'Kai'
  },
  {
    account: 'soj',
    name: 'soj',
    real_name: '菘駿'
  }, {
    account: 'tedlee',
    name: 'Ted',
    real_name: '李坤霖'
  }, {
    account: 'lai0706',
    name: 'Lai',
    real_name: 'Una'
  }, {
    account: 'andyka1714',
    name: 'Andy',
    real_name: 'andy tsai'
  }, {
    account: 'albert194',
    name: 'Albert',
    real_name: 'Albert Chen'
  }, {
    account: 'chris47',
    name: 'Chris',
    real_name: 'Chris Wang'
  }, {
    account: 'gg831006',
    name: 'Jeremy',
    real_name: 'Jeremy'
  }, {
    account: 'serendipity',
    name: 'Ray',
    real_name: 'Ray'
  }, {
    account: 'mangosu',
    name: 'Mango',
    real_name: 'mango'
  }, {
    account: 'henry97113',
    name: 'Henry',
    real_name: 'Henry'
  }, {
    account: 'oklalala',
    name: 'TonyLin',
    real_name: 'Tony Lin'
  }, {
    account: 'leiadot',
    name: '日安',
    real_name: 'leiadot'
  }, {
    account: 'jjltainan',
    name: 'Lester',
    real_name: 'Lester Lee'
  }, {
    account: 'turtle0617',
    name: 'turtle',
    real_name: 'turtle'
  }, {
    account: 'ttn',
    name: 'ttn',
    real_name: 'ttn'
  }, {
    account: 'riverli',
    name: 'River',
    real_name: 'River'
  }, {
    account: 'angel2248664',
    name: '小魚',
    real_name: 'Aria (小魚)'
  },
  {
    account: 'mark9462',
    name: 'Jimmy',
    real_name: 'Jimmy'
  }, {
    account: 'nathand',
    name: 'Nathan',
    real_name: 'Nathan'
  }, {
    account: 'jett',
    name: 'Jett',
    real_name: 'Jett'
  }
]

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function(req, res) {
  async.map(ironmans, getInfo, (err, results) => {
    res.send(results);
  })
})
app.listen(PORT);

var day = moment("20181015", "YYYYMMDD").fromNow().split("")
var todayPostNumber = []
todayPostNumber.push(day[0], day[1])
var totalPost = todayPostNumber.join('') - 1
if (Number.isNaN(totalPost)) {
  totalPost = 0
}

function getInfo(url, callback) {
  request(url, function(err, res, body) {
    var $ = cheerio.load(body)
    var link = url
    var name = $('.profile-header__name').text().trim()
    name = nameChange(name)
    var title = $('.qa-list__title--ironman').text().trim().replace(' 系列', '')
    var joinDays = $('.qa-list__info--ironman span').eq(0).text().replace(/[^0-9]/g, '')
    var posts = $('.qa-list__info--ironman span').eq(1).text().replace(/[^0-9]/g, '')
    console.log(name, posts, totalPost)
    if (posts == totalPost) {
      isNotPost.push(name)
    }
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
  let accountName = []
  let name = ''
  for (let i = (accountArray.indexOf("(") + 1); i < accountArray.indexOf(")"); i++) {
    accountName.push(accountArray[i])
  }
  accountName = accountName.join("")
  contrastList.forEach(item => {
    if (item.account === accountName) {
      name = item.name
    }
  })
  return name
}

function callSlackTag(tagContent) {
  let url = 'https://hooks.slack.com/services/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'
  let slack = new Slack()
  slack.setWebhook(url)
  slack.webhook({
    channel: '#fucking-kai',
    username: 'kai',
    icon_emoji: ":ghost:",
    text: tagContent,
  }, function(err, response) {
    console.log(response)
  })
}

function postsStatus() {
  isNotPost = []
  apiToken = 'xoxp-4772774963-383751005955-455053623381-01a5f8551542e462bd2525f7df91036e'
  var slackApi = new Slack(apiToken)
  var str = ''
  async.map(ironmans, getInfo, (err, results) => {
    //這邊再判斷list裡面的人的real_name叫什麼就可以了
    slackApi.api('users.list', function(err, response) {
      response.members.forEach(item => {
        contrastList.forEach(person => {
          if (item.real_name === person.real_name) {
            str += `<@${item.id}>`
          }
        })
      })
      console.log(str)
      callSlackTag(str)
    });
  })
}

var originHour = -1
var currentHour = -1
setInterval(function() {
  let date = new Date()
  currentHour = date.getMinutes()
  if (currentHour == originHour) {
    return
  } else {
    postsStatus()
    originHour = currentHour
  }
}, 10000)