const express = require('express')
const url = require('url')
const basicAuth = require('basic-auth');
const bodyParser = require("body-parser");
const fs = require('fs')
let argv = require('minimist')(process.argv.slice(2));


const init_file = argv.f
const port = argv.p || 7001
let routes = init_file ? JSON.parse(fs.readFileSync(init_file,{ encoding: 'utf8' })) : []
let request_log = []

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(handle_request)


function handle_request(req,resp,next) {
    if( req.path === "/_mocky/reset") return next()

    const route = [
        ...routes.filter( (r) => r.path === req.url &&  r.method === req.method ),
        ...routes.filter( (r) => r.path === req.path && r.method === req.method )
    ][0]


    if (!route) return next()

    request_log.push({ path: req.url, method: req.method, body: req.body, query: req.query})

    setTimeout( () => {
        resp.set( {"content-type": "application/json"} )
        resp.set( route.reply.headers )
        resp.status(route.reply.status || 200)
        if ( route.reply.json ) resp.write( JSON.stringify(route.reply.json))
        resp.end()
        ;
    }, (route.reply.delay || 0) * 1000)
}


app.get("/_mocky/logs", (req,resp) => {
    resp.json(request_log)
})


app.post("/_mocky/route", (req,resp) => {

    let route = req.body

    // ensure path starts with a /
    route.path = ("/" + route.path).replace("////", "/").replace("///", "/").replace("//", "/")
    routes = routes.filter( (r) => !(r.path === route.path && r.method === route.method) )
    routes = [route, ...routes]
    resp.json({})
})


app.post("/_mocky/routes", (req,resp) => {
    routes = req.body
    resp.json({})
})


app.get("/_mocky/routes", (req,resp) => {
    resp.json(routes)
})


app.get("/_mocky/reset", (req,resp) => {
    request_log = []
    routes = []
    resp.json({})
})


app.get("/_mocky/reset_logs", (req,resp) => {
    request_log = []
    resp.json({})
})


app.listen(port, () => {
    console.log( `mocky listening: http://0.0.0.0:${port}`)
})