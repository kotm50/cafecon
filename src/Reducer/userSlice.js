import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  managerName: "",
  phone: "",
  point: 0,
  role: "",
  lastLogin: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      if (action.payload.managerName !== undefined) {
        state.managerName = action.payload.managerName;
      }
      if (action.payload.userId !== undefined) {
        state.userId = action.payload.userId;
      }
      if (action.payload.phone !== undefined) {
        state.phone = action.payload.phone;
      }
      if (action.payload.admin !== undefined) {
        state.admin = action.payload.admin;
      }
      if (action.payload.point !== undefined) {
        state.point = action.payload.point;
      }
      if (action.payload.role !== undefined) {
        state.role = action.payload.role;
      }
      if (action.payload.lastLogin !== undefined) {
        state.lastLogin = action.payload.lastLogin;
      }
    },
    clearUser: () => {
      return initialState;
    },
  },
});

export const { loginUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
