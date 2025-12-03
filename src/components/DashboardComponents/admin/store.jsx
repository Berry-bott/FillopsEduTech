import { create } from "zustand"
import { mockUsers, mockMessages, mockActivityLogs } from "./mock-data"

export const useAppStore = create((set) => ({
  users: mockUsers,
  messages: mockMessages,
  activityLogs: mockActivityLogs,

  // User actions
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { ...user, ...updates } : user)),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),

  // Message actions
  addMessage: (message) => set((state) => ({ messages: [message, ...state.messages] })),
  markMessageRead: (id) =>
    set((state) => ({
      messages: state.messages.map((msg) => (msg.id === id ? { ...msg, read: true } : msg)),
    })),
  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id),
    })),

  // Activity log actions
  addActivityLog: (log) => set((state) => ({ activityLogs: [log, ...state.activityLogs] })),
}))
