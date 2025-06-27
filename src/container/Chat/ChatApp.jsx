import EmojiPicker from 'emoji-picker-react';
import { AlignJustify, Archive, EllipsisVertical, MessageSquareX, Paperclip, Phone, Trash2, User, Video, VolumeX, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';

// const socket = io('http://localhost:3000');

const users = [
  { id: 1, name: "Ritik Patidar", status: "Online" },
  { id: 2, name: "Priya Sharma", status: "Offline" },
  { id: 3, name: "Amit Yadav", status: "Online" },
];

const ChatApp = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { selectedChatType } = useSelector((state) => state?.ChatDataSlice);



  return (
    <div className="flex h-screen font-sans bg-gray-100 ">
      <>
        {/* Sidebar */}
        <ChatSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      </>
      <ChatArea showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

    </div >
  );
};

export default ChatApp;

