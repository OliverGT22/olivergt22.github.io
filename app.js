var videoContainer = document.getElementById('video-container');
var joinButton = document.getElementById('join-button');
var leaveButton = document.getElementById('leave-button');
var localStream;
var peerConnections = [];

joinButton.addEventListener('click', joinCall);
leaveButton.addEventListener('click', leaveCall);

async function joinCall() {
  try {
    // Obtener acceso a la cámara y el micrófono
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    // Mostrar el video local en el contenedor
    var localVideo = document.createElement('video');
    localVideo.srcObject = localStream;
    localVideo.autoplay = true;
    localVideo.muted = true;
    videoContainer.appendChild(localVideo);

    // Crear conexión de WebRTC para cada participante
    peerConnections = [];
    participants.forEach(function(participant) {
      createPeerConnection(participant);
    });

    // Habilitar botón de salir de la llamada
    leaveButton.disabled = false;
  } catch (error) {
    console.error('Error al unirse a la llamada:', error);
  }
}

function leaveCall() {
  // Detener el flujo de video local
  localStream.getTracks().forEach(function(track) {
    track.stop();
  });

  // Cerrar todas las conexiones de WebRTC
  peerConnections.forEach(function(peerConnection) {
    peerConnection.close();
  });

  // Limpiar el contenedor de video
  videoContainer.innerHTML = '';

  // Deshabilitar botón de salir de la llamada
  leaveButton.disabled = true;
}

function createPeerConnection(participant) {
  var peerConnection = new RTCPeerConnection();

  // Agregar el flujo de video local al PeerConnection
  localStream.getTracks().forEach(function(track) {
    peerConnection.addTrack(track, localStream);
  });

  // Manejar el flujo de video remoto
  peerConnection.ontrack = function(event) {
    var remoteVideo = document.createElement('video');
    remoteVideo.srcObject = event.streams[0];
    remoteVideo.autoplay = true;
    videoContainer.appendChild(remoteVideo);
  };

  // Configurar el intercambio de descripciones de sesión (SDP)
  peerConnection.onnegotiationneeded = async function() {
    var offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Enviar la oferta al participante remoto
    var description = { type: offer.type, sdp: offer.sdp, participant: participant };
    sendOffer(description);
  };

  peerConnections.push(peerConnection);
}

function sendOffer(description) {
  // Aquí debes implementar el código para enviar la oferta (description) al participante remoto,
  // ya sea a través de un servidor o utilizando una solución de señalización como WebSockets.
  // El participante remoto debe recibir la oferta y responder con una respuesta (answer) que también debes procesar.

  // Ejemplo de cómo podrías enviar la oferta utilizando fetch y un servidor de señalización simple:

  fetch('/offer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(description)
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Error al enviar la oferta: ' + response.status);
    }
    return response.json();
  })
  .then(function(answer) {
    // Procesar la respuesta del participante remoto
    processAnswer(answer);
  })
  .catch(function(error) {
    console.error('Error al enviar la oferta:', error);
  });
}

function processAnswer(answer) {
  var peerConnection = peerConnections.find(function(pc) {
    return pc.getRemoteStreams()[0].id === answer.participant.id;
  });

  if (peerConnection) {
    // Establecer la respuesta del participante remoto en el PeerConnection
    var remoteDescription = new RTCSessionDescription(answer);
    peerConnection.setRemoteDescription(remoteDescription)
      .catch(function(error) {
        console.error('Error al establecer la descripción remota:', error);
      });
  }
}

// Aquí deberías tener código para obtener la lista de participantes desde tu backend.
// En este ejemplo, la variable 'participants' es solo un array de objetos con información de cada participante.
var participants = [
  { id: 1, name: 'Participante 1' },
  { id: 2, name: 'Participante 2' },
  { id: 3, name: 'Participante 3' }
];
