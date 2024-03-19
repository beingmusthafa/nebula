import React, { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import io from "socket.io-client";
import { useSelector } from "react-redux";
const socket = io(import.meta.env.VITE_API_BASE_URL);

interface Props {
  courseId: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
interface Message {
  user: {
    _id: string;
    name: string;
    image: string;
  };
  message: string;
  createdAt: Date;
}
const ChatRoom: React.FC<Props> = ({ courseId, setShow }) => {
  const { currentUser } = useSelector((state: any) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const formatDate = (date: Date) => {
    const myDate = new Date();
    const day = myDate.getDate();
    const month = myDate.getMonth() + 1;
    const year = myDate.getFullYear();
    const hours = myDate.getHours();
    const minutes = myDate.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    const formattedDate = `${day}-${month}-${year} ${formattedHours}:${minutes}${ampm}`;
    return formattedDate;
  };
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLInputElement>(null);
  const getMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          "/api/get-room-messages/" +
          courseId,
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      setLoading(false);
      if (!res.success) throw new Error(res.message);
      setMessages(res.messages);
    } catch (error) {
      console.log(error);
    }
  };
  const sendMessage = () => {
    messageRef.current?.focus();
    if (!messageRef.current?.value.trim()) return;
    const message = {
      user: {
        _id: currentUser._id,
        name: currentUser.name,
        image: currentUser.image,
      },
      message: messageRef.current?.value,
      course: courseId,
      createdAt: new Date(),
    };
    socket.emit("send-message", message);
    messageRef.current.value = "";
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    getMessages();
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    socket.emit("join-course-room", courseId);
    socket.on("receive-message", (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  });
  return (
    <div className="w-full h-full fixed flex items-center justify-center z-20">
      <div className="flex flex-col border-2 border-black rounded-3xl h-[80vh] mb-10 w-[95vw] md:w-2/3 bg-sky-100 relative scroll-smooth">
        {loading ? (
          <p className="text-lg _font-dm-display mt-40 mx-auto text-slate-400">
            Loading messages...
          </p>
        ) : messages.length > 0 ? (
          <div
            className="h-full w-full flex flex-col absolute overflow-y-auto _no-scrollbar pb-20"
            ref={chatContainerRef}
          >
            {messages.map((message, index) => (
              <MessageBox
                key={index}
                name={message.user.name}
                message={message.message}
                image={message.user.image}
                position={
                  message.user._id === currentUser._id ? "right" : "left"
                }
                date={formatDate(message.createdAt)}
              />
            ))}
          </div>
        ) : (
          <p className="text-lg _font-dm-display mt-40 mx-auto text-slate-600">
            No messages yet
          </p>
        )}
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 text-slate-500"
        >
          <i className="bx bxs-x-circle text-3xl "></i>
        </button>
        <div className="flex w-full rounded-full absolute bottom-4 mx-auto justify-center">
          <form
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              sendMessage();
            }}
            className="w-5/6 flex items-center justify-center bg-slate-800 py-2 px-4 rounded-full gap-2"
          >
            <input
              ref={messageRef}
              className="p-2 pl-6 rounded-full border border-black w-full"
              placeholder="Type message"
            />
            <button type="submit">
              <i className="bx bxs-send text-3xl text-sky-500"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
