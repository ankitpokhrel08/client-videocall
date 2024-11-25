
// class PeerService {
//   constructor() {
//     if (!this.peer) {
//       this.peer = new RTCPeerConnection({
//         iceServers: [
//           {
//             urls: [
//               "stun:stun.l.google.com:19302",
//               "stun:global.stun.twilio.com:3478",
//             ],
//           },
//         ],
//       });
//     }
//   }

//   async getAnswer(offer) {
//     if (this.peer) {
//       await this.peer.setRemoteDescription(offer);
//       const ans = await this.peer.createAnswer();
//       await this.peer.setLocalDescription(new RTCSessionDescription(ans));
//       return ans;
//     }
//   }

//   async setLocalDescription(ans) {
//     if (this.peer) {
//       await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
//     }
//   }

//   async getOffer() {
//     if (this.peer) {
//       const offer = await this.peer.createOffer();
//       await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//       return offer;
//     }
//   }
// }

// export default new PeerService();

class PeerService {
  constructor(socket) {
    if (!this.peer) {
      this.socket = socket;  // Store socket here
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });

      // Set up ICE candidate relay through socket
      this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit("new-ice-candidate", event.candidate);  // Emit ICE candidates through socket
        }
      };
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  }

  async setLocalDescription(ans) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }

  addIceCandidate(candidate) {
    if (this.peer) {
      this.peer.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }
}

export default PeerService;

