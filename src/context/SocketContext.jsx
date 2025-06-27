import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  clearChatState,
  onlineStatusData,
  setGroupConversationList,
  setSelectedChatMessages,
  setSelectUser,
  setSendMessages,
  setSendMessageUpdate,
  setSingleConversationList,
  setUpdateMessages,
  setupdateMessageValue,
  setUserList,
  updateFilesList,
  updatelinksList
} from "../Redux/features/Chat/chatSlice";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageSize, setPageSize] = useState(20);
  const [userListModal, setUserListModal] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const profileData = useSelector(state => state?.authReducer?.AuthSlice?.profileDetails)
  const { selectedUser, ChatMessages, onlineStatus } = useSelector((state) => state?.ChatDataSlice);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (profileData && !socket.current) {
      socket.current = io(import.meta.env.VITE_SOCKET_URL, {
        withCredentials: true,
        query: { userId: profileData._id },
        transports: ["websocket", "polling"],
      });

      if (location?.pathname === "/") {
        socket.current.on("connect", () => {
          console.log("Connected to socket server");
          socket.current.emit("registerUser", profileData._id);
          socket.current.emit("conversation", profileData._id);
          socket.current.emit("groupConversation", profileData._id);

        });
      } else {
        socket.current.on("disconnect", () => {
          console.log("Socket disconnected");
        });
      }
      return () => {
        socket.current.disconnect();
        socket.current = null;
      };
    }
  }, [profileData, dispatch, location]);

  useEffect(() => {
    dispatch(clearChatState())
    if (socket.current) {
      socket.current.emit("conversation", profileData._id);
      socket.current.emit("getUserList");
    }
  }, [socket])


  useEffect(() => {
    if (socket.current) {
      socket.current.off("userList");
      socket.current.off("conversationCreateResult");
      socket.current.off("groupConversationResults");
      socket.current.off("conversationResults");
      socket.current.off("receiveMessage");
      socket.current.off("getMessageResults");
      socket.current.off("downloadFileResult");
      socket.current.off("getFilesResults");

      socket.current.on("userList", (userList) => {
        if (userList) {
          dispatch(setUserList(userList))
        }
      });

      socket.current.on("conversationCreateResult", (userData) => {
        if (userData) {
          dispatch(setSelectUser(userData));
        }
      });

      socket.current.on("groupConversationResults", (groupConversation) => {
        if (groupConversation?.value?.length > 0) {
          dispatch(setGroupConversationList(groupConversation?.value));
        } else {
          dispatch(setGroupConversationList([]));
        }
      });

      socket.current.on("conversationResults", (singleConversation) => {
        if (singleConversation?.value?.length > 0) {
          dispatch(setSingleConversationList(singleConversation?.value));
        } else {
          dispatch(setSingleConversationList([]));
        }
      });

      socket.current.on("receiveMessage", (messages) => {
        socket.current.emit("groupConversation", profileData._id);
        socket.current.emit("conversation", profileData._id);
        const payload = { ...selectedUser, profile: selectedUser?.image }
        const receiverDetails = selectedUser?.conversationType === "single" ? selectedUser?.members?.find(item => item._id !== profileData?._id) : payload

        if (messages?.isSenderId === profileData?._id) {//sender ka message set karne ke liye
          dispatch(setSendMessageUpdate(messages));
        }
        if (onlineStatus?.onlineUsers?.includes(messages?.isReceiverId)) socket.current.emit("deliveredMessage", messages?._id, selectedUser?.conversationType);

        if(selectedUser.conversationType === "single"){
          if (messages?.isSenderId === receiverDetails?._id && messages?.conversation_id === selectedUser?._id) { // receiver ka message set karne ke liye
            dispatch(setSendMessages(messages));
            socket.current.emit("viewMessage", messages?._id, selectedUser?.conversationType);
          }
        }else if(selectedUser.conversationType === "group"){
           if (messages?.groupId === receiverDetails?._id && messages?.isSenderId !== profileData?._id) { // receiver ka message set karne ke liye
            dispatch(setSendMessages(messages));
            socket.current.emit("viewMessage", messages?._id, selectedUser?.conversationType);
          }
        }


        // if (messages?.isSenderId === selectedUser?.receiver?._id && messages?.conversation_id === selectedUserDetails?._id && messages?.isReceiverId === profileData?._id) {
        //   socket.current.emit("viewMessage", messages?._id);
        // }

        // if (messages?.isSenderId !== profileData?._id) {
        // }

        // if (messages?.messageType === "file") dispatch(updateFilesList(messages))
        // if (messages?.messageType === "link") dispatch(updatelinksList(messages))
      });

      socket.current.on("getMessageResults", (messages) => {
        if (messages.length > 0) {
          dispatch(setSelectedChatMessages(messages));
          if (messages.length < pageSize) setHasMore(false)
        } else if (messages?.length === 0) {
          setHasMore(false)
        }
        setMessageLoading(false)
      });

      socket.current.on("updateUserStatus", (data) => {
        dispatch(onlineStatusData(data));
      });

      // socket.current.on("downloadFileResult", (MessageData) => {
      //   try {
      //     if (!MessageData?.message?._id) return;
      //     dispatch(setupdateOneMessage(MessageData.message));
      //   } catch (error) {

      //   }
      // })

      // socket.current.on("getFilesResults", (allFiles, allLinks) => {
      //   try {
      //     if (allFiles?.length > 0) dispatch(setFilesList(allFiles))
      //     else dispatch(setFilesList(allFiles))

      //     if (allLinks?.length > 0) dispatch(setLinksList(allLinks))
      //   } catch (error) {

      //   }
      // })

    }
  }, [selectedUser, profileData, dispatch]);

  const fetchMessages = async (pageNum, contact) => {
    setMessageLoading(true);
    if (socket.current) {
      const conversation_id = contact?._id
      if (conversation_id) {
        if (socket.current) {
          socket.current.emit("getuserFiles", conversation_id);
          socket.current.emit("getMessages", conversation_id, pageNum, pageSize, contact?.conversationType);
        }
      } else {
        setMessageLoading(false);
      }

    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socket,
        userListModal,
        setUserListModal,
        fetchMessages,
        messageLoading,
        setMessageLoading,
        hasMore,
        setHasMore,
        page,
        setPage,
        pageSize
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
