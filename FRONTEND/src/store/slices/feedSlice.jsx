import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },

    updateFeedUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      const user = state.find((u) => u._id === userId);
      if (user) {
        user.status = status;
      }
    },

    clearFeed: () => {
      return [];
    },
  },
});

// ✅ named exports (actions)
export const { addFeed, updateFeedUserStatus, clearFeed } = feedSlice.actions;

// ✅ DEFAULT EXPORT (VERY IMPORTANT)
export default feedSlice.reducer;
