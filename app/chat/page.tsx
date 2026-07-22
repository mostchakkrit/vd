"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { disconnectSocket, getSocket } from "@/lib/socket";
import { Users, LogOut } from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { logoutAction } from "../logout/action";

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Map<string, string>>(
    new Map(),
  );
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(
    new Map(),
  );
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [myUserId, setMyUserId] = useState("");
  const roomId = "room1";

  useEffect(() => {
    fetch("/api/socket-token")
      .then((res) => res.json())
      .then((data) => setMyUserId(data.userId));
  }, []);

  const handleSubmit = (e: React.ChangeEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
    }
    getSocket().emit("typing:stop", { roomId });
    getSocket().emit("message:send", { roomId, text: input });
    setInput("");
  };
  const handleLogout = async () => {
    disconnectSocket();
    await logoutAction();
  };
  const chatRef = useRef<HTMLDivElement>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    const socket = getSocket();

    if (!typingTimeout.current) {
      socket.emit("typing:start", { roomId });
    } else {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit("typing:stop", { roomId });
      typingTimeout.current = null;
    }, 2000);
  };
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    const handleConnect = () => {
      console.log("connected");
    };
    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }
    socket.on("typing:update", ({ userId, name, isTyping }) => {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (isTyping) next.set(userId, name);
        else next.delete(userId);
        return next;
      });
    });
    socket.on(
      "presence:snapshot",
      (users: { userId: string; name: string }[]) => {
        setOnlineUsers(new Map(users.map((u) => [u.userId, u.name])));
      },
    );

    socket.on("presence:update", ({ userId, name, online }) => {
      setOnlineUsers((prev) => {
        const next = new Map(prev);
        if (online) next.set(userId, name);
        else next.delete(userId);
        return next;
      });
    });
    socket.on("room:history", (msg) => {
      setMessages(msg);
      setHistoryLoaded(true);
    });
    socket.on("message:new", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.emit("room:join", { roomId });
    socket.emit("typing:start", { roomId });
    socket.emit("typing:stop", { roomId });
    return () => {
      socket.off("connect");
      socket.off("room:history");
      socket.off("message:new");
      socket.off("typing:update");
      socket.off("presence:update");
      socket.off("presence:snapshot");
    };
  }, []);

  return (
    <>
      <div className="bg-background my-1 flex w-full wrap-break-word max-w-md flex-col gap-4 py-3 sm:py-6  border rounded-md p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs text-gray-400 gap-2">
          <div className="flex gap-2">
            <span>{onlineUsers.size}</span>
            <Users className="h-4 w-4" />
            {Array.from(onlineUsers.entries()).map(([userId, name]) => (
              <div
                key={userId}
                className="flex items-center gap-1 text-xs text-gray-600"
              >
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {name}
              </div>
            ))}
          </div>

          <Button
            type="submit"
            title="ออกจากระบบ"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 cursor-pointer bg-white hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <div
          ref={chatRef}
          className="h-[55dvh] max-h-[65dvh] overflow-y-auto flex flex-col gap-2 list-none pr-2"
        >
          {!historyLoaded ? (
            <p className="text-center text-gray-400 h-full flex items-center  justify-center">
              กำลังโหลดข้อความ...
            </p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-400">
              ยังไม่มีข้อความในห้องนี้ พิมพ์ทักทายกันเลย
            </p>
          ) : (
            <>
              {messages.map((msg) => {
                const isMe = msg.senderId === myUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs rounded-2xl px-4 py-2 ${
                        isMe
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {!isMe && (
                        <p className="text-xs font-semibold opacity-70">
                          {msg.sender.name}
                        </p>
                      )}
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {typingUsers.size > 0 && (
          <p className="text-sm italic text-gray-500">
            {Array.from(typingUsers.values()).join(", ")} กำลังพิมพ์...
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Input
              id="sendmsg"
              name="sendmsg"
              placeholder="...ข้อความ"
              required
              value={input}
              className="h-10"
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
            <Button
              variant={"icon"}
              type="submit"
              className="w-full py-5 cursor-pointer"
            >
              ส่งข้อความ
            </Button>
          </div>
        </form>
      </div>
      <div>
        <ul>
          <li></li>
        </ul>
      </div>
    </>
  );
}
