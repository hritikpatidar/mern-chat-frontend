import React, { useEffect, useRef, useState } from "react";
import { Input } from "../Ui/Input";
import { Button } from "../Ui/Button";
import {
  Send,
  Paperclip,
  Smile,
  X,
  ChevronsDown,
  CheckCheck,
  Check,
  ArrowDownToLine,
  FileArchive,
  EllipsisVertical,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import {
  createConversation,
  setFileDownloadProgress,
  setFileUploadProgress,
  setIsDownloading,
  setIsUploading,
  setIsUserDetails,
  setSelectChat,
  setSelectedChatMessagesClear,
  setUpdateMessages,
  setViewImages,
} from "../../Redux/features/Chat/chatSlice";
import { useSocket } from "../../context/SocketContext";
import {
  getDownloadBufferFile,
  uploadFileService,
} from "../../Services/ChatServices";
import {
  FaFileAudio,
  FaFileExcel,
  FaFilePdf,
  FaFileWord,
} from "react-icons/fa"; // You can install react-icons
import {
  base64ToFile,
  checkIfImage,
  detectURLs,
  isLink,
  isValidURL,
} from "../../Utils/Auth";
import ImageLightbox from "../../components/imagePreview";
import chatBg from "../../assets/chatbg.jpg";
const ChatArea = ({
  messages,
  onSendMessage,
  messagesEndRef,
  messagesContainerRef,
}) => {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [file, setFile] = useState([]);
  const fileInputRef = useRef();

  const {
    socket,
    messageLoading,
    setMessageLoading,
    fetchMessages,
    page,
    setPage,
    hasMore,
    pageSize,
  } = useSocket();

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const { t } = useTranslation();

  const [cursor, setCursor] = useState("default");

  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const profileData = useSelector(
    (state) => state?.authReducer?.AuthSlice?.profileDetails
  );
  const selectedUserDetails = useSelector(
    (state) => state?.ChatDataSlice?.selectChatUSer
  );
  const onlineStatus = useSelector(
    (state) => state?.ChatDataSlice?.onlineStatus
  );
  const Downloading = useSelector(
    (state) => state?.ChatDataSlice?.isDownloading
  );
  const DownloadProgress = useSelector(
    (state) => state?.ChatDataSlice?.fileDownloadProgress
  );
  const imageUrl = useSelector((state) => state?.ChatDataSlice?.viewImages);
  const isUserDetails = useSelector(
    (state) => state?.ChatDataSlice?.isUserDetails
  );
  const isUploading = useSelector((state) => state?.ChatDataSlice?.isUploading);

  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  const [isNewMessage, setIsNewMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const { language } = useSelector((state) => state.language);
  const translate = language === "en" || language === "hi";
  const lastSeenTimestamp =
    onlineStatus?.lastSeen?.[selectedUserDetails?.receiver?._id];

  const lastSeenText = lastSeenTimestamp
    ? moment(lastSeenTimestamp).isSame(moment(), "day")
      ? `Last seen today at ${moment(lastSeenTimestamp).format("hh:mm A")}`
      : `Last seen ${moment(lastSeenTimestamp).format("MMM D, [at] hh:mm A")}`
    : t("offline");

  useEffect(() => {
    if (socket.current) {
      socket.current.emit("conversation", profileData._id);
      socket.current.off("deliveredResult");
      socket.current.off("viewResult");

      socket.current.on("deliveredResult", (data) => {
        const updatedMessages = messages.map((message) => {
          if (data?.message_id === message?._id) {
            return { ...message, isDelivered: true };
          }
          return message;
        });
        dispatch(setUpdateMessages(updatedMessages));
      });

      socket.current.on("viewResult", (data) => {
        const updatedMessages = messages.map((message) => {
          if (data?.message_id === message?._id) {
            return { ...message, isRead: true };
          }
          return message;
        });
        dispatch(setUpdateMessages(updatedMessages));
      });
    }
  }, [socket, messages]);

  useEffect(() => {
    setFile([]);
  }, [selectedUserDetails]);

  const handleSendButtonClick = async () => {
    setIsNewMessage(true);
    let conversation;
    if (!selectedUserDetails?._id)
      conversation = await dispatch(
        createConversation({
          isSenderId: profileData?._id,
          isReceiverId: selectedUserDetails?.receiver?._id,
          receiverRole: selectedUserDetails?.receiver?.role,
        })
      );
    else conversation = selectedUserDetails;

    let conversationId = conversation?._id || conversation?.payload?.data?._id;
    if (file.length > 0) {
      for (const [index, singleFile] of file.entries()) {
        const newMessage = {
          message: index === 0 ? messageText : "",
          fileUrl: singleFile,
          messageType: "file",
          isSenderId: profileData?._id,
          isReceiverId: selectedUserDetails?.receiver?._id,
          conversationId: conversationId,
          isRead: false,
          isDelivered: false,
          timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
          message_id: new Date().getTime().toString(),
        };
        await onSendMessage(newMessage);
      }
    } else {
      const newMessage = {
        message: messageText,
        messageType: isLink(messageText) ? "link" : "text",
        isSenderId: profileData?._id,
        isReceiverId: selectedUserDetails?.receiver?._id,
        conversationId: conversationId,
        isRead: false,
        isDelivered: false,
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
        message_id: new Date().getTime().toString(),
      };
      onSendMessage(newMessage);
    }
    setIsNewMessage(false);
    setMessageText("");
    setFile([]);
  };


  const handleAttachmentChange = async (e) => {
    const files = Array.from(e.target.files);
    try {
      if (files?.length) {
        const formData = new FormData();
        files.forEach((file, index) => {
          formData.append("img", file);
        });
        dispatch(setIsUploading(true));

        const response = await uploadFileService(formData, {
          onUploadProgress: (data) => {
            const progress = Math.round((100 * data.loaded) / data.total);
            dispatch(setFileUploadProgress(progress));
          },
        });
        let result = response?.data?.data;
        setFile((prev) => [...prev, ...result]);
      }
    } catch (error) {
      dispatch(setIsUploading(false));
      console.error({ error });
    } finally {
      dispatch(setIsUploading(false));
      setIsNewMessage(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    setFile((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmojiClick = (emojiObject) => {
    setMessageText((prevText) => prevText + emojiObject.emoji);
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      if (
        socket.current &&
        message?.isRead === false &&
        message?.isSenderId !== profileData?._id
      )
        socket.current.emit("viewMessage", message?._id);
      const date = moment(message.timestamp).format("DD/MM/YYYY");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  const downloadFile = async (url, messageId, index) => {
    try {
      dispatch(setIsDownloading(index));
      dispatch(setFileDownloadProgress(0));

      let fileName = url.split("/").pop();
      let fileExtension = fileName.split(".").pop().toLowerCase();

      // These formats should open in a new tab
      const openInNewTabFormats = ["pdf", "txt", "md", "html", "xml", "mp4"];

      if (openInNewTabFormats.includes(fileExtension)) {
        window.open(url, "_blank"); // Open in a new tab
      } else {
        let link = document.createElement("a");
        link.href = url;
        link.download = fileName || "downloaded_file";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Simulating download progress
      let simulatedProgress = 0;
      const progressInterval = setInterval(() => {
        simulatedProgress += 10;
        if (simulatedProgress <= 100) {
          dispatch(setFileDownloadProgress(simulatedProgress));
          if (socket.current) socket.current.emit("downloadFile", messageId);
        } else {
          clearInterval(progressInterval);
          dispatch(setFileDownloadProgress(100));
          dispatch(setIsDownloading(null));
        }
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      dispatch(setIsDownloading(null));
      dispatch(setFileDownloadProgress(0));
    }
  };

  const downloadImages = async (url, index) => {
    dispatch(setIsDownloading(index));
    dispatch(setFileDownloadProgress(0));
    try {
      const payload = {
        img: url,
      };
      const response = await getDownloadBufferFile(payload);

      const byteArray = new Uint8Array(response.data.data.data);
      const blob = new Blob([byteArray], { type: "image/png" });
      const objectURL = URL.createObjectURL(blob);
      let simulatedProgress = 0;
      const progressInterval = setInterval(() => {
        simulatedProgress += 10;
        if (simulatedProgress <= 100) {
          dispatch(setFileDownloadProgress(simulatedProgress));
        } else {
          clearInterval(progressInterval);
          dispatch(setFileDownloadProgress(100));
          dispatch(setIsDownloading(null));
          let link = document.createElement("a");
          link.href = objectURL;
          const fileName = objectURL.split("/").pop();
          link.download = fileName || "downloaded_file";
          link.click();
        }
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      dispatch(setIsDownloading(null));
      dispatch(setFileDownloadProgress(0));
    }
  };

  const handlePaste = async (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const items = clipboardData.items;
    const pastedImages = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const base64Image = event.target.result;
            pastedImages.push(base64Image);
            const formData = new FormData();
            const fileObject = base64ToFile(
              base64Image,
              `image-${Date.now()}.png`
            );
            formData.append("img", fileObject);
            dispatch(setIsUploading(true));

            const response = await uploadFileService(formData, {
              onUploadProgress: (data) => {
                const progress = Math.round((100 * data.loaded) / data.total);
                dispatch(setFileUploadProgress(progress));
              },
            });
            let result = response?.data?.data;
            setFile((prev) => [...prev, ...result]);
            dispatch(setIsUploading(false));
          };
          reader.readAsDataURL(file);
          e.preventDefault();
        }
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("[data-twe-dropdown-ref]")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const scrollToBottom = async () => {
    const container = messagesContainerRef.current;
    if (container) {
      setPrevScrollHeight(container.scrollHeight);
      container.scrollTop = container.scrollHeight;
    }
  };

  const handleScroll = async () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const atTop = container.scrollTop === 0;

    if (atTop) {
      const nextPage = page + 1;
      await fetchMessages(nextPage, selectedUserDetails);
      setPage(nextPage);
    }

    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setIsUserAtBottom(nearBottom);
  };

  useEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom();
    } else {
      const container = messagesContainerRef.current;
      if (!container) return;
      setPrevScrollHeight(container.scrollHeight);
      const atTop = container.scrollTop === 0;
      if (atTop) {
        setTimeout(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight;
        }, 0);
        return
      }
    }
  }, [messages]);

  return (
    <div className="relative flex flex-col flex-1 h-full">
      {selectedUserDetails ? (
        <>
          {/* Header */}
          <header
            className="p-3 px-4 flex justify-between items-center bg-[#f0ede8] cursor-pointer"
            onClick={() => {
              dispatch(setIsUserDetails(true));
            }}
          >
            <div className="flex items-center gap-3 ">
              {selectedUserDetails?.receiver?.profile ? (
                <img
                  src={selectedUserDetails?.receiver?.profile}
                  alt={selectedUserDetails?.receiver?.full_name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 text-white font-bold text-lg border">
                  {selectedUserDetails?.receiver?.full_name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>
              )}
              <div>
                <span className="text-lg font-bold">
                  {selectedUserDetails?.receiver?.full_name}
                </span>
                <div className="text-sm font-bold text-green-500">
                  {/* {selectedUserDetails.createdAt ? `Last Seen: ${moment(selectedUserDetails.createdAt).format("LL")}` : "Online"} */}

                  {onlineStatus?.onlineUsers?.includes(
                    selectedUserDetails?.receiver?._id
                  ) ? (
                    "Online"
                  ) : (
                    <span className="text-sm text-gray-500 font-normal">
                      {lastSeenText}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {!isUserDetails && (
              <div className="relative" data-twe-dropdown-ref>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen((prev) => !prev);
                  }}
                  className="btn btn-ghost btn-circle dev1"
                  whileTap={{ scale: 0.9 }}
                  id="dropdownMenuButton1tx"
                  data-twe-dropdown-toggle-ref
                  aria-expanded="false"
                  data-twe-ripple-init
                  data-twe-ripple-color="light"
                >
                  <EllipsisVertical />
                </button>
                {isMenuOpen && (
                  <div
                    aria-labelledby="dropdownMenuButton1tx"
                    data-twe-dropdown-menu-ref
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`absolute ${translate ? "right-0" : "left-0"
                      } top-10 w-56 bg-white shadow-md border  z-50 dev_clo`}
                  >
                    <ul className="text-sm text-gray-700">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMenuOpen(false);
                          dispatch(setIsUserDetails(true));
                        }}
                      >
                        {t("profile")}
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMenuOpen(false);
                          dispatch(setSelectChat(null));
                          dispatch(setSelectedChatMessagesClear([]));
                          dispatch(setIsUserDetails(false));
                        }}
                      >
                        {t("close_chat")}
                      </li>
                      {/* <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsMenuOpen(false);
                          dispatch(setSelectChat(null))
                          dispatch(setSelectedChatMessagesClear([]))
                          dispatch(setIsUserDetails(false))
                        }}
                      >
                        Delete Chat
                      </li> */}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </header>

          {/* Chat Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className={`flex-1 p-4 flex flex-col overflow-y-auto  ${selectedUserDetails ? "bg-white" : "bg-[#f0ede8]"
              }`}
          >
            {messageLoading && (
              <div
                className="absolute top-24 left-1/2 -translate-x-1/2 p-2 -translate-y-1/2  z-50 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-500/20 transition duration-300"
                style={{ width: "35px", height: "35px" }}
              >
                <Spinner className="h-8 w-8 text-secondary/50" />
              </div>
            )}
            {!isUserAtBottom && (
              <div
                className="absolute bottom-20 right-6 p-2 bg-gray-200 text-gray-700 rounded-full cursor-pointer z-50 flex items-center justify-center hover:bg-gray-500/20 transition duration-300"
                onClick={scrollToBottom}
                style={{ width: "35px", height: "35px" }}
              >
                <ChevronsDown size={20} />
              </div>
            )}
            {Object.keys(groupedMessages).length > 0 ? (
              Object.keys(groupedMessages).map((date, index) => (
                <div key={index}>
                  <div className="text-center  mb-0 text-sm text-gray-500 font-medium">
                    {moment(date, "DD/MM/YYYY").isSame(moment(), "day")
                      ? "Today"
                      : date}
                  </div>
                  {groupedMessages[date].map((message, idx) => {
                    const isSender = message.isSenderId === profileData?._id;

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isSender ? "items-end" : "items-start"
                          }`}
                      >
                        <div
                          className={`mb-2 p-3 rounded-lg max-w-xl relative ${isSender
                            ? "bg-[#9FB2CD] text-gray-50"
                            : "bg-gray-200 text-gray-800"
                            }`}
                          style={{
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          {/* ✅ Check if message is Image */}
                          {message?.messageType === "file" ? (
                            checkIfImage(message.fileUrl) ? (
                              <>
                                <div
                                  className="cursor-pointer h-60 w-60 overflow-hidden"
                                  onClick={() => {
                                    // setImageUrl([message.fileUrl]);
                                    dispatch(setViewImages([message.fileUrl]));
                                    setShowImage(true);
                                    // setPhotoIndex(idx)
                                  }}
                                >
                                  <img
                                    className="h-full w-full object-cover rounded-lg"
                                    src={message.fileUrl}
                                    alt="Sent Image"
                                  />
                                </div>
                                <div>
                                  {message?.message && (
                                    <p className="pe-3 mt-1">
                                      {detectURLs(message?.message).map(
                                        (part, index) =>
                                          isValidURL(part) ? (
                                            <a
                                              key={index}
                                              href={part}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-500 underline break-words"
                                            >
                                              {part}
                                            </a>
                                          ) : (
                                            part
                                          )
                                      )}
                                    </p>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex justify-between items-center gap-8 p-3 border rounded-lg bg-gray-100 w-full cursor-pointer">
                                  {/* Left Side: File Icon & Name */}
                                  <div
                                    className="flex items-center gap-2"
                                    onClick={() =>
                                      downloadFile(
                                        message.fileUrl,
                                        message?._id,
                                        idx
                                      )
                                    }
                                  >
                                    <span className="text-gray-600 text-3xl rounded-full">
                                      <FileArchive />
                                    </span>
                                    <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                                      {message?.fileUrl.split("/").pop()}
                                    </span>
                                  </div>

                                  {/* Right Side: Download Button */}
                                  {!message?.isDownload &&
                                    message?.isReceiverId ===
                                    profileData?._id && (
                                      <span className="bg-sky-200  rounded-full text-2xl hover:bg-gray-300 cursor-pointer transition-all duration-300">
                                        {Downloading === idx ? (
                                          <p className="text-sm font-medium text-gray-700">
                                            {DownloadProgress}%
                                          </p>
                                        ) : (
                                          <ArrowDownToLine className="text-gray-500" />
                                        )}
                                      </span>
                                    )}
                                </div>
                                <div>
                                  {message?.message && (
                                    <p className="pe-3 mt-1">
                                      {detectURLs(message?.message).map(
                                        (part, index) =>
                                          isValidURL(part) ? (
                                            <a
                                              key={index}
                                              href={part}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-500 underline break-words"
                                            >
                                              {part}
                                            </a>
                                          ) : (
                                            part
                                          )
                                      )}
                                    </p>
                                  )}
                                </div>
                              </>
                            )
                          ) : (
                            // ✅ Normal Text Message
                            <p className="pe-3">
                              {detectURLs(message?.message).map((part, index) =>
                                isValidURL(part) ? (
                                  <a
                                    key={index}
                                    href={part}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline break-words"
                                  >
                                    {part}
                                  </a>
                                ) : (
                                  part
                                )
                              )}
                            </p>
                          )}

                          {/* ✅ Message Status (Sent, Delivered, Read) */}
                          {isSender && (
                            <span className="absolute bottom-1 right-1 text-xs">
                              {message?.isDelivered && !message?.isRead ? (
                                <CheckCheck className="text-gray-600 w-4 h-4" />
                              ) : message?.isDelivered && message?.isRead ? (
                                <CheckCheck className="text-blue-500 w-4 h-4" />
                              ) : (
                                <Check className="text-gray-600 w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>

                        {/* ✅ Message Time */}
                        <span className="text-xs text-gray-400">
                          {moment(message.timestamp).format("hh:mm A")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center">
                {!messageLoading && (
                  <p className="text-gray-500 text-center ">{t("no_messages")}</p>
                )}
              </div>
            )}
            {/* Dummy div to scroll to the bottom */}
            <div ref={messagesEndRef} />
            {selectedUserDetails?.isChatDisabled && (
              <div className="flex items-center justify-center bg-white px-4 py-2">
                <p className="text-center  text-sm md:text-sm font-medium text-gray-700 bg-gray-100 px-6 py-4 w-full max-w-xl rounded-xl shadow-md">
                  You are unable to chat with this user at the moment due to a
                  dispute that has been raised. A representative will be in
                  touch with you shortly regarding this matter.{" "}
                </p>
              </div>
            )}
          </div>

          {!selectedUserDetails?.isChatDisabled && (
            <div className="p-4 border-t bg-white flex items-center gap-2 relative">
              {/* Display the image above the input */}
              {file?.length > 0 && (
                <div
                  className={`absolute -top-[210px] left-[0px] grid gap-3 bg-white rounded-md shadow-lg p-3 border border-gray-200 ${file.length === 1
                    ? "grid-cols-1"
                    : file.length === 2
                      ? "grid-cols-2"
                      : file.length === 3
                        ? "grid-cols-3"
                        : "grid-cols-4"
                    }`}
                  style={{ height: "203px", width: "auto" }}
                >
                  {file.slice(0, 4).map((img, index) => {
                    const fileExtension = img
                      ? img.split(".").pop().toLowerCase()
                      : "";

                    return (
                      <div
                        key={index}
                        className="relative flex items-center justify-center bg-gray-50 p-2 rounded-md shadow-sm"
                      >
                        {/* Display file icon or image */}
                        {fileExtension === "pdf" ? (
                          <FaFilePdf className="w-40 h-24 text-red-500" />
                        ) : fileExtension === "xlsx" ||
                          fileExtension === "xls" ? (
                          <FaFileExcel className="w-40 h-24 text-green-500" />
                        ) : fileExtension === "docx" ||
                          fileExtension === "doc" ? (
                          <FaFileWord className="w-40 h-24 text-blue-500" />
                        ) : fileExtension === "mp3" ? (
                          <FaFileAudio className="w-40 h-24 text-blue-500" />
                        ) : (
                          <img
                            src={img}
                            alt={`Preview ${index}`}
                            className="w-40 h-40 object-cover rounded-md border-2 border-gray-300"
                          />
                        )}

                        {/* Show remaining count on the 4th image */}
                        {index === 3 && file.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center rounded-md text-lg font-semibold">
                            +{file.length - 4}
                          </div>
                        )}

                        {/* Remove button */}
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 hover:text-red-700 focus:outline-none shadow-md"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <Input
                type="text"
                value={messageText}
                placeholder={t("type_a_msg")}
                className="flex-1 border-gray-400"
                onChange={(e) => {
                  const inputText = e.target.value;
                  const words = inputText.split(" ");
                  if (words.length > 0 && words[0]) {
                    words[0] = words[0][0].toUpperCase() + words[0].slice(1);
                  }
                  setMessageText(words.join(" "));
                }}
                onPaste={handlePaste}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && messageText.trim()) {
                    handleSendButtonClick();
                  }
                }}
              />

              {/* Attach File Icon */}
              <label className="p-2 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer">
                <Paperclip className="w-5 h-5" />
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  multiple
                  onChange={handleAttachmentChange}
                />
              </label>

              {/* Emoji Icon */}
              <button
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* Emoji Picker */}
              {isEmojiPickerOpen && (
                <div className="absolute bottom-14 right-4 z-10">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              <Button
                className="flex items-center gap-2"
                onClick={handleSendButtonClick}
                disabled={
                  isNewMessage || (!messageText?.trim() && file?.length === 0)
                }
              >
                <Send className="w-5 h-5" /> {t("send")}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center flex-1 flex flex-col items-center justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/851/851551.png"
            alt="message icon"
            className="w-16 h-16 mb-4"
          />
          <p className="text-black-700 text-4xl font-bold">{t("chat_msg")}</p>
          {/* <p className="text-gray-500 mt-2">Select a Contact to start chatting.</p> */}
        </div>
      )}
      {showImage && (
        <ImageLightbox
          downloadImages={downloadImages}
          setShowImage={setShowImage}
        />
      )}
      {isUploading && (
        <div
          className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex flex-col items-center justify-center backdrop-brightness-50"
          style={{ cursor }}
        >
          <div className="flex h-[20rem] justify-center items-center">
            <Spinner className="h-8 w-8 text-white/50" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
