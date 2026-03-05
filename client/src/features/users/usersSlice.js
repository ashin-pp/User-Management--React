import { createSlice } from '@reduxjs/toolkit';
// this is the most important
const initialState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setUsers: (state, action) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },

    addUser: (state, action) => {
      state.users.push(action.payload);
    },

    updateUser: (state, action) => {
      const { id, userData } = action.payload;
      const userIndex = state.users.findIndex(user => user._id === id);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...userData };
      }
    },

    deleteUser: (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter(user => user._id !== userId);
    },

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },

    clearUsers: (state) => {
      state.users = [];
      state.selectedUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export default usersSlice.reducer;
export const {
  setLoading,
  setError,
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setSelectedUser,
  clearSelectedUser,
  clearUsers
} = usersSlice.actions;

// Selectors
export const selectUsers = (state) => state.users.users;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectSelectedUser = (state) => state.users.selectedUser;
export const selectUserById = (state, userId) => state.users.users.find(user => user._id === userId);
