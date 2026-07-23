import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.API_URL, {
      reconnectionDelayMax: 10000,
      auth: (cb) => {
        fetch("/api/socket-token")
          .then((res) => {
            if (!res.ok) throw new Error("not authenticated");
            return res.json();
          })
          .then((data) => cb({ token: data.token }));
      },
    });
  }
  return socket;
}
export function disconnectSocket() {
  socket?.disconnect();
  socket = undefined;
}
