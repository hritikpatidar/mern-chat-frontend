import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getConversationService, getUserListService } from "../../../Services/ChatServices";
import { createConversationService } from "../../../Services/ChatServices/chatServices";

// Initial state
const initialState = {
  userList: [],//userList ke liye
  selectChatUSer: null, // selectChatUSer ke liye
  conversationList: [], // conversationList ke liye
  selectedChatType: undefined, // selectedChatType ke liye (individual/group)
  selectedChatMessages: [],
  onlineStatus: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  viewImages: [],
  loading: false,
  error: null,
  isFirstLoad: true,
  isUserDetails: false,
  filesList: [],
  linksList: []
};

export const getUserList = createAsyncThunk(
  "chat/getUserList",
  async (role) => {
    const response = await getUserListService(role);
    return response.data || [];
  }
);

export const createConversation = createAsyncThunk(
  "chat/createConversation",
  async (payload) => {
    const response = await createConversationService(payload);
    return response.data || {};
  }
);
export const getConversation = createAsyncThunk(
  "chat/getConversation",
  async () => {
    const response = await getConversationService();
    return response.data || [];
  }
);




// Create chat slice using createSlice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectChat: (state, action) => {
      state.selectChatUSer = action.payload;
    },
    setSelectedChatType: (state, action) => {
      state.selectedChatType = action.payload;
    },
    setConversationList: (state, action) => {
      state.conversationList = action.payload;
    },
    setSelectedChatMessagesClear: (state, action) => {
      state.selectedChatMessages = [...action.payload]
    },
    setUpdateMessages: (state, action) => {
      state.selectedChatMessages = action.payload;
    },
    setSelectedChatMessages: (state, action) => {
      state.selectedChatMessages = [...action.payload, ...state.selectedChatMessages];
    },
    setSelectedUpdateChatMessages: (state, action) => {
      state.selectedChatMessages = [...state.selectedChatMessages, action.payload];
    },
    // setupdateMessageValue: (state, action) => {
    //   if (state.selectedChatMessages.length > 0) {
    //     state.selectedChatMessages[state.selectedChatMessages.length - 1] = action.payload
    //   }
    // },
    setupdateMessageValue: (state, action) => {
      if (!Array.isArray(action.payload)) {
        action.payload = [action.payload]; // 🛠 Single message ko array me convert kar diya
      }

      action.payload.forEach((newMessage) => {
        const index = state.selectedChatMessages.findIndex((msg) => msg.message_id === newMessage.message_id);

        if (index !== -1) {
          // 🔄 Update existing message
          state.selectedChatMessages[index] = { ...state.selectedChatMessages[index], ...newMessage };
          // } else {
          //   // ➕ Add new message if it doesn't exist
          //   state.selectedChatMessages.push(newMessage);
        }
      });
    },
    setupdateOneMessage: (state, action) => {
      const { _id } = action.payload;
      const message = state.selectedChatMessages.find(msg => msg._id === _id);
      if (message) {
        message.isDownload = true; // Directly update without reassigning array
      }
    },
    setIsUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setIsDownloading: (state, action) => {
      state.isDownloading = action.payload;
    },
    setFileDownloadProgress: (state, action) => {
      state.fileDownloadProgress = action.payload;
    },
    setFileUploadProgress: (state, action) => {
      state.fileUploadProgress = action.payload;
    },
    setViewImages: (state, action) => {
      state.viewImages = action.payload
    },
    closeChat: (state) => {
      state.selectChatUSer = {};
      state.selectedChatType = undefined;
      state.selectedChatMessages = [];
    },
    addMessage: (state, action) => {
      state.selectedChatMessages.push(action.payload);
    },
    onlineStatusData: (state, action) => {
      state.onlineStatus = action.payload;
    },
    setIsUserDetails: (state, action) => {
      state.isUserDetails = action.payload
    },
    setFilesList: (state, action) => {
      state.filesList = action.payload
    },
    updateFilesList: (state, action) => {
      state.filesList = [action.payload, ...state.filesList]
    },
    setLinksList: (state, action) => {
      state.linksList = action.payload
    },
    updatelinksList: (state, action) => {
      state.linksList = [action.payload, ...state.linksList]
    },

    clearChatState: (state, action) => {
      // state.userList = [];
      state.isUserDetails = false
      state.selectChatUSer = null;
      // state.conversationList = [];
      state.selectedChatType = undefined;
      state.selectedChatMessages = [];
      state.filesList = []
      state.linksList = []
      // state.onlineStatus = [];
      // state.isUploading = false;
      // state.isDownloading = false;
      // state.fileUploadProgress = 0;
      // state.fileDownloadProgress = 0;
      // state.loading = false;
      // state.error = null;
      // state.isFirstLoad = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload.data || [];
        state.error = "";
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.loading = false;
        state.userList = [];
        state.error = action.error.message;
      })
      //-----------------------------------------------------------
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.selectChatUSer = action.payload.data || {};
        state.error = "";
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.selectChatUSer = {};
        state.error = action.error.message;
      })
      //-----------------------------------------------------------
      .addCase(getConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationList = action.payload.data || [];
        state.error = "";
      })
      .addCase(getConversation.rejected, (state, action) => {
        state.loading = false;
        state.conversationList = [];
        state.error = action.error.message;
      })
  },
});

// Export actions and reducer
export const {
  setSelectChat,
  setConversationList,
  setSelectedChatType,
  setSelectedChatMessages,
  setUpdateMessages,
  setSelectedUpdateChatMessages,
  setSelectedChatMessagesClear,
  setupdateMessageValue,
  setupdateOneMessage,
  setIsUploading,
  setIsDownloading,
  setFileDownloadProgress,
  setFileUploadProgress,
  setViewImages,
  closeChat,
  addMessage,
  onlineStatusData,
  setIsUserDetails,
  setFilesList,
  updateFilesList,
  setLinksList,
  updatelinksList,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
