# mocky-server

A HTTP based mock server.

Mocky aids testing of your applications by hosting mock responses so that your applications do not have to talk to real endpoints. 


### Installation
```
npm install mocky-server -g
```

### Command line

```
mocky -p <port> -f <init_routes.json>
```

### Example Usage

1) Startup up the mocky server

```
mocky
> mocky listening: http://0.0.0.0:7001
```

2) Setup an endpoint  
```
curl -0 -v -X POST http://localhost:7001/_mocky/route \
-H 'Content-Type: application/json' \
-d @- << EOF
{ 
  "method": "GET", 
  "path": "/hello?aa=bb",   
  "reply": {
    "status": 200, 
    "headers": {"qqqq": "wwww"},
    "json": {"hello": "world"}, 
    "delay": 0 
  } 
}
EOF
```


3) Review
```
curl http://localhost:7001/_mocky/routes

> [{"method":"GET","path":"/hello?aa=bb","reply":{"status":200,"headers":{"qqqq":"wwww"},"json":{"hello":"world"},"delay":0}}]
```

4) Call
```
curl -v http://localhost:7001/hello?aa=bb

*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 7001 (#0)
> GET /hello HTTP/1.1
> Host: localhost:7001
> User-Agent: curl/7.51.0
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< content-type: application/json
< qqqq: wwww
< Date: Thu, 02 Feb 2017 17:18:11 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked
<
* Curl_http_done: called premature == 0
* Connection #0 to host localhost left intact
{"hello":"world"}

```

5) View request log

```
curl http://localhost:7001/_mocky/logs

> [{"url":"/hello","path":"/hello?aa=bb","method":"GET","body":{},"query":{"aa": "bb"}}]
```

6) Reset

Remove all routes and logs:

```
curl http://localhost:7001/_mocky/reset
```


# Ruby Adapter
```
require './mocky'

Mocky::start
Mocky::reset

Mocky.route({
    method: :GET, path: "/hello",
    reply: {
      json: {hello: "world"},
    }
})

puts RestClient.get 'http://localhost:7001/hello'
puts Mocky.logs

Mocky::stop
```
```
mocky listening: http://0.0.0.0:7001
{"hello":"world"}
[{"url":"/hello","path":"/hello","method":"GET","body":{},"query":{}}]
```


