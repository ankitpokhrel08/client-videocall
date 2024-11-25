// import { useEffect, useCallback, useState } from "react";
// import ReactPlayer from "react-player";
// import peer from "../services/peer";
// import { useSocket } from "../context/SocketProvider";

// const RoomPage = () => {
//   const socket = useSocket();
//   const [remoteSocketId, setRemoteSocketId] = useState(null);
//   const [myStream, setMyStream] = useState();
//   const [remoteStream, setRemoteStream] = useState();

//   const handleUserJoined = useCallback(({ email, id }) => {
//     console.log(`Email ${email} joined room`);
//     setRemoteSocketId(id);
//   }, []);

//   const handleCallUser = useCallback(async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });

//     const offer = await peer.getOffer();
//     socket.emit("user:call", { to: remoteSocketId, offer });
//     setMyStream(stream);
//   }, [remoteSocketId, socket]);

//   const handleIncomingCall = useCallback(
//     async ({ from, offer }) => {
//       setRemoteSocketId(from);
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setMyStream(stream);
//       console.log(`Incoming Call`, from, offer);
//       const ans = await peer.getAnswer(offer);
//       socket.emit("call:accepted", { to: from, ans });
//     },
//     [socket]
//   );

//   const sendStreams = useCallback(() => {
//     for (const track of myStream.getTracks()) {
//       peer.peer.addTrack(track, myStream);
//     }
//   }, [myStream]);

//   const handleCallAccepted = useCallback(
//     ({ ans }) => {
//       peer.setLocalDescription(ans);
//       console.log("Call Accepted!");
//       sendStreams();
//     },
//     [sendStreams]
//   );

//   const handleNegoNeeded = useCallback(async () => {
//     const offer = await peer.getOffer();
//     socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
//   }, [remoteSocketId, socket]);

//   useEffect(() => {
//     peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
//     return () => {
//       peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
//     };
//   }, [handleNegoNeeded]);

//   const handleNegoNeedIncoming = useCallback(
//     async ({ from, offer }) => {
//       const ans = await peer.getAnswer(offer);
//       socket.emit("peer:nego:done", { to: from, ans });
//     },
//     [socket]
//   );

//   const handleNegoNeedFinal = useCallback(async ({ ans }) => {
//     await peer.setLocalDescription(ans);
//   }, []);

//   useEffect(() => {
//     peer.peer.addEventListener("track", async (ev) => {
//       const remoteStream = ev.streams;
//       console.log("GOT TRACKS!!");
//       setRemoteStream(remoteStream[0]);
//     });
//   }, []);

//   useEffect(() => {
//     socket.on("user:joined", handleUserJoined);
//     socket.on("incoming:call", handleIncomingCall);
//     socket.on("call:accepted", handleCallAccepted);
//     socket.on("peer:nego:needed", handleNegoNeedIncoming);
//     socket.on("peer:nego:final", handleNegoNeedFinal);

//     return () => {
//       socket.off("user:joined", handleUserJoined);
//       socket.off("incoming:call", handleIncomingCall);
//       socket.off("call:accepted", handleCallAccepted);
//       socket.off("peer:nego:needed", handleNegoNeedIncoming);
//       socket.off("peer:nego:final", handleNegoNeedFinal);
//     };
//   }, [
//     socket,
//     handleUserJoined,
//     handleIncomingCall,
//     handleCallAccepted,
//     handleNegoNeedIncoming,
//     handleNegoNeedFinal,
//   ]);

//   return (

//     // <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
//     //   <div className="flex justify-end px-4 pt-4">
//     //     <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
//     //       Room Page
//     //     </h1>
//     //     <p className="font-normal text-gray-700 dark:text-gray-400">
//     //       {remoteSocketId ? "Connected" : "No one in room"}
//     //     </p>
//     //     {myStream && (
//     //       <button
//     //         onClick={sendStreams}
//     //         className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//     //       >
//     //         Send Stream
//     //       </button>
//     //     )}
//     //     {remoteSocketId && (
//     //       <button
//     //         onClick={handleCallUser}
//     //         className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//     //       >
//     //         CALL
//     //       </button>
//     //     )}
//     //   </div>
//     //   {myStream && (
//     //     <>
//     //       <h1>My Stream</h1>
//     //       <ReactPlayer
//     //         playing
//     //         muted
//     //         height="100px"
//     //         width="200px"
//     //         url={myStream}
//     //       />
//     //     </>
//     //   )}
//     //   {remoteStream && (
//     //     <>
//     //       <h1>Remote Stream</h1>
//     //       <ReactPlayer
//     //         playing
//     //         muted
//     //         height="300px"
//     //         width="500px"
//     //         url={remoteStream}
//     //       />
//     //     </>
//     //   )}
//     // </div>
//     <div className="w-full max-w-lg mx-auto bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-900 dark:border-gray-800">
//       <div className="flex items-center justify-between px-6 pt-6">
//         <div>
//           <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
//             Room Page
//           </h1>
//           <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
//             {remoteSocketId ? "Connected" : "No one in room"}
//           </p>
//         </div>
//         <div className="space-x-2">
//           {myStream && (
//             <button
//               onClick={sendStreams}
//               className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800 transition ease-in-out duration-300"
//             >
//               Send Stream
//             </button>
//           )}
//           {remoteSocketId && (
//             <button
//               onClick={handleCallUser}
//               className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition ease-in-out duration-300"
//             >
//               CALL
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="px-6 py-4 space-y-6">
//         {myStream && (
//           <div>
//             <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
//               My Stream
//             </h2>
//             <div className="rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
//               <ReactPlayer
//                 playing
//                 muted
//                 height="150px"
//                 width="100%"
//                 url={myStream}
//                 className="rounded-lg"
//               />
//             </div>
//           </div>
//         )}

//         {remoteStream && (
//           <div>
//             <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
//               Remote Stream
//             </h2>
//             <div className="rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
//               <ReactPlayer
//                 playing
//                 muted
//                 height="250px"
//                 width="100%"
//                 url={remoteStream}
//                 className="rounded-lg"
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RoomPage;

//
import { useEffect, useCallback, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import PeerService from "../services/peer"; // Import the updated PeerService

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [peerService, setPeerService] = useState(null); // Track the PeerService instance

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  // Initialize PeerService instance
  useEffect(() => {
    const peer = new PeerService(socket);
    setPeerService(peer);

    return () => {
      // Clean up if needed, like closing the peer connection
      if (peer.peer) {
        peer.peer.close();
      }
    };
  }, [socket]);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);

    if (peerService) {
      const offer = await peerService.getOffer(); // Get offer from PeerService
      socket.emit("user:call", { to: remoteSocketId, offer });
    }
  }, [remoteSocketId, socket, peerService]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);

      if (peerService) {
        const ans = await peerService.getAnswer(offer); // Get answer from PeerService
        socket.emit("call:accepted", { to: from, ans });
      }
    },
    [socket, peerService]
  );

  const sendStreams = useCallback(() => {
    if (myStream && peerService) {
      for (const track of myStream.getTracks()) {
        peerService.peer.addTrack(track, myStream); // Send your local stream to the peer connection
      }
    }
  }, [myStream, peerService]);

  const handleCallAccepted = useCallback(
    ({ ans }) => {
      if (peerService) {
        peerService.setLocalDescription(ans); // Set the remote description on PeerService
        console.log("Call Accepted!");
        sendStreams();
      }
    },
    [sendStreams, peerService]
  );

  const handleNegoNeeded = useCallback(async () => {
    if (peerService) {
      const offer = await peerService.getOffer(); // Get offer from PeerService
      socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }
  }, [remoteSocketId, socket, peerService]);

  useEffect(() => {
    if (peerService) {
      peerService.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    }
    return () => {
      if (peerService) {
        peerService.peer.removeEventListener(
          "negotiationneeded",
          handleNegoNeeded
        );
      }
    };
  }, [handleNegoNeeded, peerService]);

  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peerService.getAnswer(offer); // Get answer from PeerService
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket, peerService]
  );

  const handleNegoNeedFinal = useCallback(
    async ({ ans }) => {
      await peerService.setLocalDescription(ans); // Set the remote description on PeerService
    },
    [peerService]
  );

  // Set up remote stream
  useEffect(() => {
    if (peerService) {
      peerService.peer.addEventListener("track", (ev) => {
        const remoteStream = ev.streams[0]; // Assuming only one stream
        setRemoteStream(remoteStream);
      });
    }
  }, [peerService]);

  // Handle socket events
  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeedIncoming,
    handleNegoNeedFinal,
  ]);

  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between px-6 pt-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Room Page
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            {remoteSocketId ? "Connected" : "No one in room"}
          </p>
        </div>
        <div className="space-x-2">
          {myStream && (
            <button
              onClick={sendStreams}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800 transition ease-in-out duration-300"
            >
              Send Stream
            </button>
          )}
          {remoteSocketId && (
            <button
              onClick={handleCallUser}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition ease-in-out duration-300"
            >
              CALL
            </button>
          )}
        </div>
      </div>

      <div className="px-6 py-4 space-y-6">
        {myStream && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              My Stream
            </h2>
            <div className="rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <video
                autoPlay
                muted
                height="150px"
                width="100%"
                ref={(ref) => {
                  if (ref && myStream) {
                    ref.srcObject = myStream;
                  }
                }}
                className="rounded-lg"
              />
            </div>
          </div>
        )}

        {remoteStream && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Remote Stream
            </h2>
            <div className="rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <video
                autoPlay
                height="250px"
                width="100%"
                ref={(ref) => {
                  if (ref && remoteStream) {
                    ref.srcObject = remoteStream;
                  }
                }}
                className="rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
