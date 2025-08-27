/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const user = useSelector((state) => state.account.userInfo);
  const socket = io("localhost:8080");

  useEffect(() => {
    if (socket && user) {
      socket.on("connect", () => {
        console.log("Connected to socket server");
        // Join room based on user role
        const role = user.roleWithPermission?.name;
        socket.emit("joinRoom", role);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
