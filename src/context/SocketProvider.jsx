import { createContext, useContext, useMemo } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

// eslint-disable-next-line react/prop-types
function SocketProvider({children}) {
  const socket = useMemo(() => io("https://server-videocall.onrender.com/"), []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export default SocketProvider;
