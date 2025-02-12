import React, { useState, useEffect } from "react";

const ChatWindow = ({ session, myUserName }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session) {
      const chatSignalHandler = (event) => {
        if (event.from.connectionId === session.connection.connectionId) {
          return;
        }
        const sender = event.from && event.from.data ? event.from.data : "Anonymous";
        const newMessage = {
          sender,
          text: event.data,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      session.on("signal:chat", chatSignalHandler);
      return () => {
        session.off("signal:chat", chatSignalHandler);
      };
    }
  }, [session]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (session && message.trim() !== "") {
      session
        .signal({
          data: message,
          type: "chat",
        })
        .then(() => {
          const newMessage = {
            sender: myUserName,
            text: message,
            timestamp: new Date().toLocaleTimeString(),
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setMessage("");
        })
        .catch((error) => {
          console.error("메시지 전송 에러:", error);
        });
    }
  };

  return (
    <div className="h-full flex flex-col ">
      <div className="flex-1 overflow-y-auto bg-white p-2 ">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2 text-sm">
            <strong>{msg.sender}</strong>: {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-2 flex border-t border-gray-600 rounded">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-2 bg-white text-black rounded placeholder:text-black"
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-red-500 text-white rounded">
          전송
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
