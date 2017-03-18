// var express = require('express')
// var data = require('./data.json')
var http = require('http')
var routerReq = require('router')
var bodyParser = require('body-parser')
var requestIP = require('request-ip')
var server
var router
var counter = 1
var hilist = {}

router = new routerReq()

server = http.createServer(function (request, response) {
  router(request, response, function (error) {
    if (!error) {
      response.writeHead(404)
    } else {
      console.log(error.message, error.stack)
      response.writeHead(400)
    }
    response.end('RESTful API Server is running')
  })
})

// listen port 1998
server.listen(1998, function () {
  console.log('Listening on port 1998...\n')
})
router.use(bodyParser.json())

// handler a POST request through RESTful
function createItem (request, response) {
  var id = 'cup' + counter++
  var item = request.body

  hilist[id] = item
  response.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  console.log('A POST request from ' + requestIP.getClientIp(request) + '\n- Create Item -> ' + id + ':\ndata: ' + JSON.stringify(item) + '\n')
  response.end('Item ID = ' + id)
}
router.post('/helloHI', createItem)

// handler a GET request through RESTful api
function readItem (request, response) {
  var id = request.params.id
  var item = hilist[id]

  // 檢驗完整性(用資安的方法？ MDF5？？)
  if (typeof item !== 'object') {
    console.log('item not found!')
    response.writeHead(404)
    response.end('\n')
    return
  }

  console.log('Read Item : ', id, item)

  response.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  response.end('Read ' + id + ':' + JSON.stringify(item))
}
router.get('/helloHI/:id', readItem)

// handler a DELETE request through RESTful api
function deleteItem (request, response) {
  var id = request.params.id

  if (typeof hilist[id] !== 'object') {
    console.log('item not found!', id)
    response.writeHead(404)
    response.end('\n')
    return
  }
  console.log('Delete item', id)

  hilist[id] = undefined
  response.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  response.end('Delete successful!')
}
router.delete('/helloHI/:id', deleteItem)

// handler a GET request through RESTful api
function readList (request, response) {
  var id = request.params.id
  var item
  var itemlist = []

  for (id in hilist) {
    if (!hilist.hasOwnProperty(id)) {
      continue
    }
    item = hilist[id]

    if (typeof item !== 'object') {
      continue
    }
    itemlist.push(item)
  }

  console.log('Read list : ' + JSON.stringify(hilist))

  response.writeHead(200, {
    'Content-Type': 'text/plain'
  })

  response.end('List : ' + JSON.stringify(hilist))
}
router.get('/helloHI', readList)

// handler a PUT request through RESTful api
function updateItem (request, response) {
  var id = request.params.id
  var item = request.body

  console.log(id, item)
  console.log('hi')

  if (typeof hilist[id] !== 'object') {
    console.log('item not found!', id)
    response.writeHead(404)
    response.end('\n')
    return
  }
  console.log('Update item', id, item)

  console.log('hi = ' + item)
  hilist[ id ] = item
  response.writeHead(200, {
    'Content-Type': 'text/plain',
    'Location': '/helloHI/' + id
  })

  response.end('Updated ' + JSON.stringify(item))
}
router.put('/helloHI/:id', updateItem)
