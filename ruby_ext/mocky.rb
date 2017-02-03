require 'rest-client'

module Mocky

  def self.start
    `lsof -ti TCP:7001 | xargs kill -9`
    @mocky_pid = fork do
      exec 'mocky'
    end
    sleep 1
  end

  def self.route route
    RestClient.post 'http://localhost:7001/_mocky/route', route.to_json, {'Content-Type' => 'application/json'}
  end

  def self.routes
    JSON.parse( RestClient.get('http://localhost:7001/_mocky/routes').body)
  end


  def self.logs
    JSON.parse( RestClient.get('http://localhost:7001/_mocky/logs').body)
  end

  def self.reset
    RestClient.get 'http://localhost:7001/_mocky/reset'
  end

  def self.stop
    Process.kill( "HUP", @mocky_pid )
  end

end