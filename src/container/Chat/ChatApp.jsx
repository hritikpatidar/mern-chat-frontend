import EmojiPicker from 'emoji-picker-react';
import { AlignJustify, Archive, Bell, ChevronDownIcon, Clock, EllipsisVertical, File, Image, LifeBuoy, LogOut, MessageSquarePlus, MessageSquareX, MoveLeft, Music, Paperclip, Phone, Search, Settings, Smile, SunMoon, Trash2, User, UserPlus, Video, VolumeX, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { clearLocalStorage, getItemLocalStorage, setItemLocalStorage } from '../../Utils/browserServices';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useSocket } from '../../context/SocketContext';
import ChatSidebar from './ChatSidebar';

// const socket = io('http://localhost:3000');

const users = [
  { id: 1, name: "Ritik Patidar", status: "Online" },
  { id: 2, name: "Priya Sharma", status: "Offline" },
  { id: 3, name: "Amit Yadav", status: "Online" },
];

const ChatApp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { socket } = useSocket()
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isUserDetailsView, setIsUserDetailsView] = useState(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      let msgContent = {};
      if (chatType === "single") {
        msgContent = {
          conversationId: "684fc66a067a4fc539d38684", //684fc66a067a4fc539d38684 
          isSenderId: "681f41c31db558fb452cd754", // sender's user ID
          isReceiverId: "68242db5216d67de02b7f9c0", //68242db5216d67de02b7f9c0 
          groupId: "", //68500e1faad63c8b915c5ecc 
          message: message,
          fileUrl: "",
          messageType: "text", // "text" | "image" | "video" | "file"
          status: "sent",      // "sent" | "delivered" | "read"
        };
      } else if (chatType === "group") {
        msgContent = {
          conversationId: "", //684fc66a067a4fc539d38684 
          isSenderId: "681f41c31db558fb452cd754", // sender's user ID
          isReceiverId: "", //68242db5216d67de02b7f9c0 
          groupId: "685290ffc60461b559661507", //68529121c60461b55966150a 
          message: message,
          fileUrl: "",
          messageType: "text", // "text" | "image" | "video" | "file"
          status: "sent",      // "sent" | "delivered" | "read"
        };
      }

      if (socket) socket.current.emit('sendMessage', msgContent);
      setMessage('');
    }
  };

  // useEffect(() => {
  //   socket.current.emit("groupConversation", "681f41c31db558fb452cd754");
  //   socket.current.emit("conversation", "681f41c31db558fb452cd754");
  //   socket.current.on('receiveMessage', (msg) => {
  //     setMessages((prev) => [...prev, msg]);

  //   });

  //   socket.current.on("groupConversationResults", (conversationList) => {
  //   });

  //   socket.current.on("conversationResults", (conversationList) => {
  //   });

  //   socket.current.on("updateUserStatus", (data) => {
  //   });

  //   return () => {
  //     socket.off('receiveMessage');
  //   };
  // }, []);

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevText) => prevText + emojiObject.emoji);
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
    }
  };



  return (
    <div className="flex h-screen font-sans bg-gray-100 ">
      <>
        {/* Sidebar */}
        <ChatSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      </>
      {true ? (
        <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-gray-200 px-6 py-10">
          <button
           onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-4 sm:hidden p-2 rounded-md hover:bg-gray-400 transition text-gray-700  cursor-pointer"
          >
            <AlignJustify className="w-6 h-6" />
          </button>
          <div className="text-center max-w-md relative z-10">
            <div className="mx-auto w-28 h-28 mb-6 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-300">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                alt="Start Chat"
                className="w-16 h-16 opacity-80"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              No Conversation Selected
            </h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
              To get started, choose a person from the chat list or begin a new conversation. <br />
              Stay connected, share your thoughts, and collaborate in real-time — all in one place.
            </p>
          </div>
        </div>

      ) : (
        <>
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-gray-300 px-6 py-2 shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  className="sm:hidden text-2xl hover:bg-gray-400 p-2 text-gray-700 cursor-pointer rounded-md"
                  onClick={() => setShowSidebar(true)}
                >
                  <AlignJustify />
                </button>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 text-white font-bold text-lg border">
                  {chatType
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-md font-bold text-gray-800">
                    {chatType.charAt(0).toUpperCase() + chatType.slice(1)}
                  </h2>
                  <p className="text-sm text-green-600">
                    {chatType === "single" ? "active now" : "5 members | active now"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-3">
                <div className="hidden sm:flex items-center gap-3">
                  <button className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer">
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer"
                    onClick={() => setIsUserDetailsView(!isUserDetailsView)}
                  >
                    <User className="w-5 h-5" />
                  </button>
                </div>

                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer">
                      <EllipsisVertical aria-hidden="true" className="w-5 h-5" />
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    {/* New Options */}
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition"
                      onClick={() => console.log("Archive clicked")}
                    >
                      <Archive className="w-5 h-5" />
                      Archive
                    </button>

                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition"
                      onClick={() => console.log("Mute clicked")}
                    >
                      <VolumeX className="w-5 h-5" />
                      Mute
                    </button>

                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition"
                      onClick={() => console.log("Clear Conversation clicked")}
                    >
                      <MessageSquareX className="w-5 h-5" />
                      Clear Conversation
                    </button>

                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition"
                      onClick={() => console.log("Delete Chat clicked")}
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                      Delete Chat
                    </button>
                  </MenuItems>
                </Menu>
              </div>
            </div>

            {/* Message Container */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gray-100">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`px-4 py-2 max-w-xs rounded-xl ${i % 2 === 0
                    ? "bg-gray-500 text-white self-start"
                    : "bg-white text-gray-800 self-end ml-auto"
                    }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>

            {/* Input Box */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 relative">
              {/* Paperclip Button with Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleFileClick}
                  className="rounded-md hover:bg-gray-400 p-2 text-gray-700 transition duration-200 cursor-pointer"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>



              {/* Emoji Button with Picker */}
              {/* <div className="relative">
              <button
                type="button"
                className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer"
                onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
              >
                <Smile className="w-5 h-5" />
              </button>

              {isEmojiPickerOpen && (
                <div className="absolute bottom-full mb-2 -right-30  z-10 w-64 max-w-xs scale-90 origin-bottom-right sm:w-40">
                  <EmojiPicker className="w-5 h-5" onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div> */}
              {/* <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer"
                  onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
                >
                  <Smile aria-hidden="true" className="w-5 h-5" />
                </MenuButton>
              </div>
              {isEmojiPickerOpen && (
                <MenuItems
                  transition
                  className="absolute -right-40 bottom-10 z-10 w-56 sm:ml-20 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <EmojiPicker className="w-5 h-5" onEmojiClick={handleEmojiClick} />
                </MenuItems>
              )}
            </Menu> */}

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-md border border-gray-500 focus:outline-none text-gray-800"
              />

              <button
                type="submit"
                className="bg-gray-600 text-white px-5 py-2 rounded-md hover:bg-gray-700 cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </>
      )}

      {
        isUserDetailsView && (
          <div
            className={`fixed z-20 top-0 right-0 h-full w-96 bg-gray-200 border-l border-gray-300 p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out
            ${isUserDetailsView ? "translate-x-0" : "translate-x-full"} sm:relative sm:translate-x-0`}
          >          <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">User Info</h2>
              <button
                className=" text-xl text-gray-700 cursor-pointer hover:bg-gray-400 p-2 rounded-md"
                onClick={() => setIsUserDetailsView(false)}
              >
                <X />
              </button>
            </div>

            {/* User Avatar */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-white font-bold">
                {chatType.charAt(0).toUpperCase()}
              </div>
              <h3 className="mt-3 text-xl font-semibold text-gray-800">John Doe</h3>
              <p className="text-sm text-gray-500">Online</p>
            </div>

            {/* More Details */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-500">Email</h4>
                <p className="text-sm font-medium text-gray-800">john@example.com</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Location</h4>
                <p className="text-sm font-medium text-gray-800">Indore, MP</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Status Message</h4>
                <p className="text-sm font-medium text-gray-800">"Living the code life!"</p>
              </div>
            </div>
          </div>
        )
      }

    </div >
  );
};

export default ChatApp;

