// var data = require('./data.json')
var request = require('request')
var method = process.argv[2] || 'POST'
var url = process.argv[3] || 'http://127.0.0.1:1998/helloHI'
var data = process.argv[4] || { UUID : '1234567890'}

//console.log(method, url, data)

var options = {
  headers: {'Connection': 'close'},
  url: url,
  method: method,
  json: true,
  body: data
}

function callback (error, response, data) {
  if (!error && response.statusCode === (200 || 201 || 202 || 204)) {
    console.log('Info :\n', data)
  }
}

request(options, callback)
