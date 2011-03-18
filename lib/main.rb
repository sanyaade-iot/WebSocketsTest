require 'rubygems'
require 'sinatra'
require 'em-websocket'
require 'thin'
require 'json'

IP_HOST = "0.0.0.0" #"169.254.221.190"

EventMachine.run do
  class MyApp < Sinatra::Base
    set :root, File.dirname(__FILE__)
    set :bind, IP_HOST

    get '/' do
      erb :default
    end

    get '/:name.js' do |name|
      erb "#{name}.js".to_sym
    end

    #get '/main.js' do
    #  erb "main.js".to_sym
    #end

    sockets = []

    EventMachine::WebSocket.start(:host => IP_HOST, :port => 8080) do |ws|

      ws.onopen {
        puts "Websocket connection opened"
        sockets << ws
      }

      ws.onmessage { |msg|
        sockets.each { |socket| socket.send msg if socket != ws }
      }

      ws.onclose {
        puts "Websocket connection closed"
        sockets.delete(ws)
      }

    end
  end
  MyApp.run!
end

