import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearChatState, getConversation, getUserList, setFilesList, setLinksList, setSelectChat, setSelectedChatMessages, setSelectedChatMessagesClear } from "../../Redux/features/Chat/chatSlice";
import { Spinner } from "@material-tailwind/react";
import { useSocket } from "../../context/SocketContext";
import moment from "moment";

const ChatSidebar = ({ onSelectContact, messagesContainerRef }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { socket, userListModal, setUserListModal, fetchMessages, setHasMore, setPage } = useSocket();

  const [isListLoading, setIsListLoading] = useState(false);
  const userLists = useSelector((state) => state?.ChatDataSlice?.userList);
  const profileData = useSelector((state) => state?.authReducer?.AuthSlice?.profileDetails);
  const conversationList = useSelector((state) => state?.ChatDataSlice?.conversationList);
  const selectedUserDetails = useSelector((state) => state?.ChatDataSlice?.selectChatUSer);
  const [searchValue, setSearchValue] = useState("")
  const [searchConversationUSer, setSearchConversationUSer] = useState("")
  const filterData = userLists?.filter((resource) => {
    const fullName = resource?.full_name?.toLowerCase() || "";
    const email = resource?.email?.toLowerCase() || "";
    const search = searchValue.toLowerCase();

    return fullName.includes(search) || email.includes(search);
  });


  const tabList = profileData?.role === "Admin"
    ? [t("sell_er"), t("cus_tomer")]
    : [t("Admin"), t("Customer")];
  const [activeTab, setActiveTab] = useState(profileData?.role === "Admin" ? "Seller" : "Admin");

  const adminUsers = conversationList.filter(user => user?.receiver?.role === "Admin");
  const otherUsers = conversationList.filter(user => user?.receiver?.role !== "Admin");
  const lastAdminIndex = adminUsers.length - 1;

  const sortedUsers = [...adminUsers, ...otherUsers];
  const conversationFilterData = sortedUsers?.filter((resource) => {
    const fullName = `${resource?.receiver?.full_name.toLowerCase()}`;
    return fullName.includes(searchConversationUSer.toLowerCase());
  });

  useEffect(() => {
    fetchConversation()
  }, [])

  const fetchConversation = async () => {
    try {
      const response = await dispatch(getConversation())
      if (response?.payload?.status === false) {
        dispatch(setSelectChat(null))
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  const handleBackClick = () => {
    dispatch(clearChatState())
    navigate("/");
  };

  const handleUserModal = async (tab) => {
    setActiveTab(tab)
    setUserListModal(true);
    setIsListLoading(true);
    try {
      const response = await dispatch(getUserList(tab));
    } catch (error) {
      console.error("Error loading users list", error);
    } finally {
      setIsListLoading(false);
    }
  }

  const handleSelectConversation = (contact) => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
    dispatch(setFilesList([]))
    dispatch(setLinksList([]))
    dispatch(setSelectChat(contact))
    dispatch(setSelectedChatMessagesClear([]))
    setHasMore(true)
    setPage(1);
    fetchMessages(1, contact)
  }

  return (
    <>
      <div className="w-1/4 bg-gray-100  shadow-lg border-r overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <button onClick={handleBackClick} className="text-gray-700 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold"> {t("chat")}</h2>
          <button className="text-gray-700 hover:text-gray-800" onClick={() => handleUserModal(activeTab)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="px-4 py-2 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder={t("search_conversations")}
              value={searchConversationUSer}
              onChange={(e) => { setSearchConversationUSer(e.target.value) }}
              className="w-full border border-gray-500 rounded-lg px-4 py-2 pr-10 outline-none text-gray-700 focus:ring-0"
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
              {searchConversationUSer ?
                <X onClick={() => setSearchConversationUSer("")} className="w-5 h-5 cursor-pointer text-gray-700 hover:text-gray-800" />
                :
                <Search className="w-5 h-5 text-gray-700" />
              }
            </span>
          </div>
        </div>

        {/* Scrollable List */}
        <ul className="h-[calc(100vh-130px)] overflow-y-auto ">
          {conversationFilterData.length > 0 ? (
            conversationFilterData.map((contact, index) => {
              const isYour = contact?.lastMessageDetails?.isSenderId === profileData?._id;
              return (
                <>
                  <li
                    key={index}
                    onClick={() => handleSelectConversation(contact)}
                    className={`w-full p-4 border-b ${selectedUserDetails?._id === contact?._id && "bg-[#f0ede8]"
                      } hover:bg-[#f0ede8] cursor-pointer flex items-center gap-3 justify-between`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {contact?.receiver?.profile ? (
                        <img
                          src={contact?.receiver?.profile}
                          alt={contact?.receiver?.full_name}
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-14 h-12 rounded-full flex items-center justify-center bg-gray-300 text-white font-bold text-lg border">
                          {contact?.receiver?.full_name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <div className="w-full">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-gray-900 font-semibold">{contact?.receiver?.full_name}</span>
                          <span className="text-gray-500 text-xs time">{moment(contact?.lastMessageDetails?.timestamp).format(t("hh:mm A"))}</span>
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <p className="text-gray-600 text-sm truncate">
                            {isYour ? t("you") + ": " : ""}
                            {contact?.lastMessageDetails?.messageType === "file"
                              ? "File"
                              : contact?.lastMessageDetails?.message?.length > 20
                                ? contact?.lastMessageDetails?.message.substring(0, 20) + "..."
                                : contact?.lastMessageDetails?.message || t("start_chat")}
                          </p>
                          {contact?.lastMessageDetails?.unReadMessages > 0 && (
                            <span className="bg-gray-400 text-black-400 text-xs font-bold px-2 py-1 rounded-full">
                              {contact?.lastMessageDetails?.unReadMessages}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                  {index === lastAdminIndex && adminUsers.length > 0 && <hr className="border-t-2 border-gray-300 my-2" />}
                </>
              );
            })
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 p-4 text-center w-full">{t("no_contacts_available")}</p>
            </div>
          )}
        </ul>
      </div>

      {
        userListModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Header with Close Button */}
              <div className="flex justify-between items-center mb-4">
                {/* <h2 className="text-xl font-bold text-gray-700"> {t("user_list")} </h2> */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("search_users")}
                    onChange={(e) => { setSearchValue(e.target.value) }}
                    value={searchValue}
                    className="border border-gray-500 rounded-lg px-3 py-2 pr-10 outline-none text-gray-700 focus:outline-none focus:ring-0"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 ">
                    {searchValue ?
                      <X onClick={() => setSearchValue("")} className="w-5 h-5 cursor-pointer text-gray-700 hover:text-gray-800" />
                      :
                      <Search className="w-5 h-5 text-gray-700" />
                    }
                  </span>
                </div>
                <button onClick={() => setUserListModal(false)} className="text-gray-700 hover:text-gray-800">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tabs Section */}
              <div className="flex border-b">
                {tabList.map((tab) => (
                  <button
                    key={tab}
                    className={`flex-1 py-2 text-center text-sm font-semibold ${activeTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
                      }`}
                    onClick={() => handleUserModal(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Scrollable User List */}
              <div className="mt-4 max-h-60 min-h-60 overflow-y-auto">
                {isListLoading ?
                  <>
                    <div className="flex  justify-center items-center">
                      <Spinner className="h-8 w-8 text-secondary/50" />
                    </div>
                  </>
                  :
                  filterData.length > 0 ? (
                    filterData.map((user, index) => (
                      <div key={index} className="flex justify-start items-center p-2 border-b cursor-pointer"
                        onClick={() => onSelectContact(user)}
                      >
                        {user.profile ? (
                          <img
                            src={user.profile}
                            alt={user.full_name}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 text-white font-bold text-lg border">
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="ml-3">
                          <p className="font-semibold">{user.full_name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">{t("no_users_in_this")} {activeTab.toLowerCase()}.</p>
                  )}
              </div>
            </motion.div>
          </motion.div>
        )
      }
    </>
  );
};

export default ChatSidebar;
