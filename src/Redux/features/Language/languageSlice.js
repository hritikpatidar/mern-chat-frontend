import { createSlice } from "@reduxjs/toolkit";
import i18n from "../../../translate/i18n"; // Path to your i18n configuration file

const initialState = {
  language: "en", // Default language
  direction: "ltr",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      const newLang = action.payload;
      state.language = newLang;
      // state.direction = newLang === "ar" ? "rtl" : "ltr";
      state.direction = (newLang === "ar" || newLang === "ur") ? "rtl" : "ltr";
      i18n.changeLanguage(newLang); // Change language in i18n
      document.dir = state.direction; // Update document direction
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
