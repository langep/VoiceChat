[![Build Status](https://travis-ci.org/langep/VoiceChat.svg?branch=master)](https://travis-ci.org/langep/VoiceChat)

# VoiceChat

VoiceChat is a WebRTC applications. This app uses a mesh architecture compared to using a MCU or SFU.

This is simple to implement and requires little backend infrastructure. The only required pieces are a signaling server (which is provided by the Phoenix app) and a STUN server (we are using google's stun servers). We are not using a TURN server and just hope people are unproblematic networks.

The downsides are that it requires more compute power on the client side due to encoding and decoding multiple streams. It also scales poorly because each new client adds N - 1 new connections (i.e. it connects to everyone but itself).

## Notice

This was a toy project to learn about Elixir, Phoenix and WebRTC. It is by no means a production ready system.

## Usage

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

For now, you need to provide your username as query parameter e.g. 
[`localhost:4000?name=AwesomeUser`](http://localhost:4000?name=AwesomeUser).

## Try it

You can try it out here https://fathomless-everglades-76462.herokuapp.com/?name=test.
