// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/web/endpoint.ex":
import {Socket, Presence} from "phoenix"


// let socket = new Socket("/socket", {params: {token: window.userToken}})
let socket = new Socket("/socket", {params: {user_id: window.userId}})


socket.connect()

let userList = document.getElementById("user-list")
let sendButton = document.getElementById("send-btn")
let chatInput = document.getElementById("chat-input")
let chatMessages = document.getElementById("chat-messages")
let room = socket.channel("rooms:lobby", {})
let presences = {}

sendButton.addEventListener('click', function() {
  const content = chatInput.value;
  room.push('comment:add', { content: content });
  chatInput.value = ""
});

room.on("presence_state", state => {
  presences = Presence.syncState(presences, state)
  renderPresences(presences)
  onInitialPresencesReceived(presences)
})

room.on("presence_diff", diff => {
  presences = Presence.syncDiff(presences, diff)
  renderPresences(presences)
})

room.on("comment:new", comment => {
  renderComment(comment)
});

room.join()

const listBy = (id, {metas: [first, ...rest]}) => {
  first.name = id
  first.count = rest.length + 1
  return first
}

const renderPresences = presences => {
  userList.innerHTML = Presence.list(presences, listBy)
    .map(user => `
      <li class="collection-item valign-wrapper">
        <i class="left material-icons small valign">account_circle</i>        
        <span>${user.name}</span>
    `)
    .join("")
}

const renderComment = comment => {
  chatMessages.innerHTML += `
    <li class="">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">${comment.user_id}</span>
          <p>${comment.content}</p>
        </div>
      </div>
    </li>
  `
}

///////////////////////////////////////////////////////////
import Peer from 'simple-peer';

let streams = document.getElementById('streams')

let hasOwnMediaStream = false;
let ownMediaStream = null;
let peers = {}

async function getMedia() {
  const stream = navigator.mediaDevices.getUserMedia({audio: true, video: false})
  stream.catch(err => console.log("Error getting media", err))
  let media = await stream;
  ownMediaStream = media;
  hasOwnMediaStream = true;
  setStreamOnPeers()
}

let setStreamOnPeers = () => {
  console.log('we just got the stream')
  for (let userId in peers) {
    if (peers.hasOwnProperty(userId)) {
      if (hasOwnMediaStream) {
        if (peers[userId].streams.length == 0) {
          peers[userId].addStream(ownMediaStream);
        } else {
          console.log(`we already have a stream for peer: ${userId}`)
        }
      } else {
        console.log(`stream not ready yet for peer: ${userId}`)
      }
    }
  }
}

getMedia()

room.on(`initiate:${window.userId}`, data => {
  peers[data.other] = createPeer(data.other)
})

room.on(`signal:${window.userId}`, data => {
  peers[data.other].signal(data.signal)
  console.log(data.signal)
})

const onInitialPresencesReceived = (presences) => {
  for (let userId in presences) {
    if (presences.hasOwnProperty(userId)) {
      if (userId != window.userId) {
        peers[userId] = createPeer(userId, true)
        room.push(`initiate:${userId}`, {other: window.userId}) 
      }
    }
  }
}

const createPeer = (userId, initiator = false)  => 
{
  let peer = Peer({initiator: initiator, trickle: true})
  if (hasOwnMediaStream) {
    peer.addStream(ownMediaStream)
  }
  peer.on('data', logReceivedData(userId))
  peer.on('signal', sendSignal(userId))  
  peer.on('stream', createVideoTagAndStream)
  peer.on('connect', () => {
    console.log("CONNECTED")
    peer.send("Hello");
  })

  return peer
}

const logReceivedData = userId => {
  return function(data) {
    console.log(`got a message from ${userId}: ${data}` )  
  }
}

const sendSignal = userId => {
  return function(signal) {
    room.push(`signal:${userId}`, {other: window.userId, signal})
  }
}

const createVideoTagAndStream = stream => {
  let video = document.createElement('video')
  streams.appendChild(video)   
  video.srcObject = stream
  video.play()
}

///////////////////////////////////////////////////////////

export default socket
