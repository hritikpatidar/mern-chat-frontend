import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getItemLocalStorage } from "../../../Utils/browserServices";
import { LoginService, profileDetailsService, SignupService } from "../../../Services/AdminServices";


const initialState = {
  loading: false,
  token: "",
  profileDetails: {},
  notificationList: [],
  error: "",
};


export const signupForm = createAsyncThunk(
  "auth/signupDetails",
  async (payload) => {
    const response = await SignupService(payload)
    return response.data
  }
)

export const loginFormData = createAsyncThunk(
  "auth/loginDetails",
  async (payload) => {
    const fcmToken = getItemLocalStorage("fcm_token");
    if (payload instanceof FormData) {
      payload.append('fcm_token', fcmToken);
    } else {
      payload = {
        ...payload,
        "fcm_token": fcmToken
      };
    }
    const response = await LoginService(payload)
    return response.data
  }
)

export const profileDetails = createAsyncThunk(
  "auth/profileDetails",
  async () => {
    const response = await profileDetailsService()
    return response.data
  }
)

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutSuccess: (state) => {
      state.loading = false;
      state.token = "";
      state.profileDetails = {}
      state.notificationList = [];
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signupForm.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signupForm.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload?.token || "";
      state.profileDetails = action.payload?.data || {};
      state.error = "";
    });
    builder.addCase(signupForm.rejected, (state, action) => {
      state.loading = false;
      state.token = "";
      state.profileDetails = {};
      state.error = action.error.message;
    });
    //------------------------------------------------------------------
    builder.addCase(loginFormData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginFormData.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload?.token;
      state.error = "";
    });
    builder.addCase(loginFormData.rejected, (state, action) => {
      state.loading = false;
      state.token = "";
      state.error = action.error.message;
    });
    //------------------------------------------------------------------
    builder.addCase(profileDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(profileDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.profileDetails = action.payload?.data || {};
      state.error = "";
    });
    builder.addCase(profileDetails.rejected, (state, action) => {
      state.loading = false;
      state.profileDetails = {};
      state.error = action.error.message;
    });
  },
});

export const { logoutSuccess } = AuthSlice.actions;
export default AuthSlice.reducer;
