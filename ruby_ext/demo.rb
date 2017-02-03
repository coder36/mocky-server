require './mocky'

Mocky::start
Mocky::reset

Mocky.route({
    method: :GET, path: "/hello?a=1",
    reply: {
      json: {hello: "world"},
    }
})


Mocky.route({
   method: :GET, path: "/hello",
   reply: {
       json: {hello: "no query string"},
   }
})

Mocky.route({
   method: :POST, path: "/save",
   reply: {
       json: {data: "saved"},
   }
})

puts RestClient.get 'http://localhost:7001/hello?a=1'
puts RestClient.get 'http://localhost:7001/hello'

Mocky.route({
    method: :GET, path: "/hello?a=1",
    reply: {
       json: {hello: "mark"},
    }
})

puts RestClient.get 'http://localhost:7001/hello?a=1'



puts RestClient.post 'http://localhost:7001/save', {some: "data"}
puts Mocky.logs
Mocky::stop

