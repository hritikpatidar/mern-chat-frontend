import EmojiPicker from 'emoji-picker-react';
import { AlignJustify, Bell, Clock, EllipsisVertical, File, Image, LifeBuoy, LogOut, MessageSquarePlus, MoveLeft, Music, Paperclip, Phone, Search, Settings, Smile, SunMoon, User, UserPlus, Video, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { clearLocalStorage, getItemLocalStorage, setItemLocalStorage } from '../../Utils/browserServices';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:3000');

const users = [
  { id: 1, name: "Ritik Patidar", status: "Online" },
  { id: 2, name: "Priya Sharma", status: "Offline" },
  { id: 3, name: "Amit Yadav", status: "Online" },
];

const ChatApp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [chatType, setChatType] = useState("single")
  const [isUserDetailsView, setIsUserDetailsView] = useState(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Optional: Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    socket.current = io('http://localhost:3000', {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.current.on("connect", () => {
      console.log("Connected to socket server");
      socket.current.emit("registerUser", "681f41c31db558fb452cd754");
    });

    socket.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    return () => {
      socket.current.disconnect();
      socket.current = null;
    };
  }, []);

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

      socket.current.emit('sendMessage', msgContent);
      setMessage('');
    }
  };

  useEffect(() => {
    socket.current.emit("groupConversation", "681f41c31db558fb452cd754");
    socket.current.emit("conversation", "681f41c31db558fb452cd754");
    socket.current.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);

    });

    socket.current.on("groupConversationResults", (conversationList) => {
    });

    socket.current.on("conversationResults", (conversationList) => {
    });

    socket.current.on("updateUserStatus", (data) => {
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

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
      // You can handle the file upload logic here
    }
  };

  const handleSignOut = () => {
    setLoading(true);
    setTimeout(() => {
      const fcmToken = getItemLocalStorage("fcm_token");
      clearLocalStorage();
      if (fcmToken) {
        setItemLocalStorage("fcm_token", fcmToken);
      }
      dispatch({ type: "RESET" });
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="flex h-screen font-sans bg-gray-100 ">
      <>
        {/* Sidebar */}
        <div
          className={`fixed z-20 h-full w-72 bg-gray-200 border-r border-gray-300 p-4 flex flex-col transform transition-transform duration-300 ease-in-out 
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} sm:relative sm:translate-x-0 sm:w-96`} ref={dropdownRef}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex justify-between items-center">
            <span>RN Events</span>

            <div className="flex items-center gap-2">
              <button
                className="text-xl text-gray-700 hover:bg-gray-400 p-2 cursor-pointer rounded-md"
                onClick={() => setIsUserListOpen(!isUserListOpen)}
              >
                <MessageSquarePlus />
              </button>
              <button
                className="sm:hidden text-xl hover:bg-gray-400 p-2 text-gray-700 cursor-pointer rounded-md"
                onClick={() => setShowSidebar(false)}
              >
                <X />
              </button>
              <button
                className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <EllipsisVertical />
              </button>
              {/* Dropdown List */}
              {isDropdownOpen && (
                <div className="absolute right-4 top-12 mt-2 w-48 sm:w-56 bg-gray-100 border border-gray-300 rounded-xl shadow-xl z-50 divide-y divide-gray-300 text-sm">
                  {/* Profile Section */}
                  <button
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-200 text-gray-800 transition"
                    onClick={() => console.log("Profile clicked")}
                  >
                    <User className="w-5 h-5 text-gray-700" />
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-200 text-gray-800 transition"
                    onClick={() => console.log("Account Settings clicked")}
                  >
                    <Settings className="w-5 h-5 text-gray-700" />
                    Account Settings
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-200 text-gray-800 transition"
                    onClick={() => console.log("Theme Toggle clicked")}
                  >
                    <SunMoon className="w-5 h-5 text-gray-700" />
                    Theme: Light/Dark
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-200 text-gray-800 transition"
                    onClick={() => console.log("Notifications clicked")}
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    Notifications
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-200 text-gray-800 transition"
                    onClick={() => console.log("Support clicked")}
                  >
                    <LifeBuoy className="w-5 h-5 text-gray-700" />
                    Support
                  </button>

                  {/* Logout */}
                  <button
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-red-100 transition"
                    onClick={() => setIsLogoutModalOpen(true)}
                  >
                    <LogOut className="w-5 h-5 text-red-600" />
                    <span className="text-red-600 font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </h3>
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search or start a new chat"
              className="w-full px-3 py-2 pl-10 rounded-md border border-gray-300 bg-white focus:outline-none text-sm text-gray-800"
            />
          </div>

          {/* Tabs: Group / Single */}
          <div className="flex mb-4 border border-gray-300 rounded-md overflow-hidden">
            <button
              className={`flex-1 py-2 text-sm font-medium ${chatType === "single" ? "bg-gray-300 text-gray-900" : "bg-white text-gray-600 cursor-pointer"}`}
              onClick={() => setChatType("single")}
            >
              Single
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${chatType === "group" ? "bg-gray-300 text-gray-900" : "bg-white text-gray-600 cursor-pointer"}`}
              onClick={() => setChatType("group")}
            >
              Group
            </button>
          </div>

          {/* Recent Chats */}
          <ul className="space-y-2 overflow-y-auto flex-1">
            {(chatType === "single" ? ["John Doe"] : ["College Friends"]).map((name, i) => (
              <li
                key={i}
                className="cursor-pointer flex items-center gap-3 p-2 rounded-md hover:bg-gray-300 shadow-sm"
              >
                {/* Profile circle (initials) */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white font-semibold">
                  {name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </div>

                {/* Name and message */}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{name}</p>
                  <p className="text-xs text-gray-600">This theme is awesome!</p>
                </div>

                {/* Time */}
                <span className="text-xs text-gray-500">2:06 min</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`fixed z-20 h-full w-72 sm:w-96 bg-gray-200 border-r border-gray-300 p-4 flex flex-col transform transition-transform duration-300 ease-in-out 
          ${isUserListOpen ? "translate-x-0" : "-translate-x-100"}`}
        >
          {/* Header */}
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex justify-between items-center">
            <button
              className="text-xl text-gray-700 hover:bg-gray-400 p-2 cursor-pointer rounded-md"
              onClick={() => setIsUserListOpen(false)}
            >
              <MoveLeft />
            </button>
          </h3>

          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search or start a new chat"
              className="w-full px-3 py-2 pl-10 rounded-md border border-gray-300 bg-white focus:outline-none text-sm text-gray-800"
            />
          </div>

          <h3 className="text-gray-500 font-bold ml-2 mb-3">Connect with us</h3>

          {/* User List */}
          <ul className="space-y-2 overflow-y-auto flex-1">
            {["John Doe", "Ritik Patidar"].map((name, i) => (
              <li
                key={i}
                className="cursor-pointer flex items-center gap-3 p-2 rounded-md hover:bg-gray-300 shadow-sm"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white font-semibold">
                  {name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{name}</p>
                  <p className="text-xs text-gray-600">This theme is awesome!</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
      <>
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gray-300 px-6 py-2 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Hamburger for mobile */}
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
                  <Phone />
                </button>
                <button className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer">
                  <Video />
                </button>
                <button
                  className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer"
                  onClick={() => setIsUserDetailsView(!isUserDetailsView)}
                >
                  <User />
                </button>
              </div>

              <button className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer">
                <EllipsisVertical onClick={() => setIsUserDetailsView(!isUserDetailsView)} />
              </button>
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
                <Paperclip />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>



            {/* Emoji Button with Picker */}
            <div className="relative">
              <button
                type="button"
                className="rounded-md hover:bg-gray-400 p-2 text-gray-700 cursor-pointer"
                onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
              >
                <Smile />
              </button>

              {isEmojiPickerOpen && (
                <div className="absolute bottom-full mb-2 -right-30  z-10 w-64 max-w-xs scale-90 origin-bottom-right sm:w-40">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

            </div>

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

      {/* User Details Sidebar */}
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

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 sm:px-0">
          <div className="bg-gray-100 border border-gray-300 shadow-2xl rounded-xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 transition-all duration-300">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Are you sure you want to logout?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Your session will end immediately.
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-md border border-gray-400 text-gray-800 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className={`w-full sm:w-auto px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition ${loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default ChatApp;

