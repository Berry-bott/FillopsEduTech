
// src/store/tutorCommunityStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import useTutorAuthStore from "./tutorAuthStore";
import {
  getSocket,
  joinGroup,
  leaveGroup,
  sendGroupMessage,
  startGroupTyping,
  stopGroupTyping,
} from "../lib/communitySocketService";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => useTutorAuthStore.getState().accessToken || null;

const useTutorCommunityStore = create(
  devtools(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────
      groups:        [],
      activeGroupId: null,
      activeGroup:   null,
      messages:      {},   // { [groupId]: Message[] }
      pagination:    {},   // { [groupId]: { hasMore, nextCursor } }
      typingUsers:   {},   // { [groupId]: Map<userId, userName> }
      onlineCounts:  {},   // { [groupId]: number }

      loadingGroups:   false,
      loadingMessages: false,
      loadingOlder:    false,
      sendingMessage:  false,
      sidebarOpen:     true,
      error:           null,

      currentUser:   null,
      typingTimeout: null,

      // ── UI ─────────────────────────────────────────────────────────
      setSidebarOpen: (val)  => set({ sidebarOpen: val }),
      clearError:     ()     => set({ error: null }),
      setCurrentUser: (user) => set({ currentUser: user }),

      // ── GET /api/community/groups ──────────────────────────────────
      fetchGroups: async () => {
        const token = getToken();
        if (!token) return set({ error: "Not authenticated" });
        set({ loadingGroups: true, error: null });
        try {
          const res = await fetch(`${BASE_URL}/api/community/groups`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const { data: groups = [] } = await res.json();
          const onlineCounts = {};
          groups.forEach((g) => { onlineCounts[g.id] = g.onlineCount || 0; });
          set({ groups, onlineCounts, loadingGroups: false });
        } catch {
          set({ error: "Failed to load groups", loadingGroups: false });
        }
      },

      // ── GET /api/community/groups/:groupId ─────────────────────────
      fetchGroupDetails: async (groupId) => {
        const token = getToken();
        if (!token || !groupId) return;
        try {
          const res = await fetch(`${BASE_URL}/api/community/groups/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const { data } = await res.json();
          set({ activeGroup: data });
        } catch {
          set({ error: "Failed to load group details" });
        }
      },

      // ── Open / Close Group ─────────────────────────────────────────
      openGroup: async (groupId) => {
        const { activeGroupId } = get();
        if (activeGroupId && activeGroupId !== groupId) {
          leaveGroup(activeGroupId);
          get().stopTyping();
        }
        set((s) => ({
          activeGroupId: groupId,
          activeGroup:   null,
          messages:    { ...s.messages,    [groupId]: s.messages[groupId]    || [] },
          typingUsers: { ...s.typingUsers, [groupId]: s.typingUsers[groupId] || new Map() },
        }));
        await Promise.all([
          get().fetchGroupDetails(groupId),
          get().fetchMessages(groupId),
        ]);
        const socket = getSocket();
        if (socket?.connected) {
          joinGroup(groupId, (res) => {
            if (res?.success) {
              set((s) => ({ onlineCounts: { ...s.onlineCounts, [groupId]: res.onlineCount } }));
            } else {
              set({ error: res?.message || "Failed to join group" });
            }
          });
        }
      },

      closeGroup: (groupId) => {
        if (get().activeGroupId === groupId) {
          leaveGroup(groupId);
          get().stopTyping();
          set({ activeGroupId: null, activeGroup: null });
        }
      },

      // ── GET /api/community/groups/:groupId/messages ────────────────
      fetchMessages: async (groupId, cursor = null) => {
        const token = getToken();
        if (!token || !groupId) return;
        const isOlder = !!cursor;
        set(isOlder ? { loadingOlder: true } : { loadingMessages: true });
        try {
          let url = `${BASE_URL}/api/community/groups/${groupId}/messages?limit=50`;
          if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const { data: { messages: newMsgs, pagination } } = await res.json();
          set((s) => ({
            messages: {
              ...s.messages,
              [groupId]: isOlder
                ? [...newMsgs, ...(s.messages[groupId] || [])]
                : newMsgs,
            },
            pagination:      { ...s.pagination, [groupId]: pagination },
            loadingMessages: false,
            loadingOlder:    false,
          }));
        } catch {
          set({ loadingMessages: false, loadingOlder: false });
        }
      },

      loadOlderMessages: async () => {
        const { activeGroupId, pagination, loadingOlder } = get();
        if (!activeGroupId || loadingOlder) return;
        const page = pagination[activeGroupId];
        if (!page?.hasMore || !page?.nextCursor) return;
        await get().fetchMessages(activeGroupId, page.nextCursor);
      },

      // ── POST /api/community/groups/:groupId/messages ───────────────
      sendMessage: async (content) => {
        const { activeGroupId } = get();
        if (!activeGroupId || !content?.trim()) return;
        const trimmed = content.trim();
        set({ sendingMessage: true });
        get().stopTyping();

        const socket = getSocket();
        if (socket?.connected) {
          sendGroupMessage(
            { groupId: activeGroupId, content: trimmed, type: "TEXT" },
            (ack) => {
              set({ sendingMessage: false });
              if (!ack?.success) set({ error: ack?.message || "Failed to send" });
            }
          );
        } else {
          // REST fallback when socket is not connected
          const token = getToken();
          try {
            const res = await fetch(
              `${BASE_URL}/api/community/groups/${activeGroupId}/messages`,
              {
                method:  "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization:  `Bearer ${token}`,
                },
                body: JSON.stringify({ content: trimmed, type: "TEXT" }),
              }
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const { data: msg } = await res.json();
            set((s) => ({
              messages: {
                ...s.messages,
                [activeGroupId]: [...(s.messages[activeGroupId] || []), msg],
              },
            }));
          } catch {
            set({ error: "Failed to send message" });
          }
          set({ sendingMessage: false });
        }
      },

      // ── Typing ─────────────────────────────────────────────────────
      startTyping: () => {
        const { activeGroupId, typingTimeout } = get();
        if (!activeGroupId) return;
        startGroupTyping(activeGroupId);
        if (typingTimeout) clearTimeout(typingTimeout);
        set({ typingTimeout: setTimeout(() => get().stopTyping(), 2500) });
      },

      stopTyping: () => {
        const { activeGroupId, typingTimeout } = get();
        if (typingTimeout) clearTimeout(typingTimeout);
        if (activeGroupId) stopGroupTyping(activeGroupId);
        set({ typingTimeout: null });
      },

      initializeListeners: () => {
        const socket = getSocket();
        if (!socket) return;

        const handlers = {
          "group:new_message": (msg) => {
            if (!msg?.groupId) return;
            set((s) => ({
              messages: {
                ...s.messages,
                [msg.groupId]: [...(s.messages[msg.groupId] || []), msg],
              },
              groups: s.groups.map((g) =>
                g.id === msg.groupId ? { ...g, lastMessage: msg } : g
              ),
            }));
          },

          // ── Typing fix: require groupId from server payload ──────────
          "group:typing": (data) => {
            // Always log in dev so you can verify server payload shape
            console.log("[socket] group:typing →", data);

            const groupId = data?.groupId;
            if (!groupId || !data?.userId) return; // drop malformed events

            set((s) => {
              const prev = s.typingUsers[groupId] || new Map();
              const map  = new Map(prev);
              data.isTyping
                ? map.set(data.userId, data.userName ?? "Someone")
                : map.delete(data.userId);
              return { typingUsers: { ...s.typingUsers, [groupId]: map } };
            });
          },

          "group:member_count": (data) => {
            if (data?.groupId)
              set((s) => ({ onlineCounts: { ...s.onlineCounts, [data.groupId]: data.count } }));
          },

          "group:user_joined": (data) => {
            if (data?.groupId)
              set((s) => ({ onlineCounts: { ...s.onlineCounts, [data.groupId]: data.onlineCount } }));
          },

          "group:user_left": (data) => {
            if (data?.groupId)
              set((s) => ({ onlineCounts: { ...s.onlineCounts, [data.groupId]: data.onlineCount } }));
          },

          "group:deactivated": (data) => get().handleGroupRemoved(data.groupId, data.message),
          "group:deleted":     (data) => get().handleGroupRemoved(data.groupId, data.message),
        };

        Object.entries(handlers).forEach(([e, fn]) => socket.on(e, fn));

        // Return cleanup so useSocket can remove handlers before re-attaching
        return () => {
          Object.entries(handlers).forEach(([e, fn]) => socket.off(e, fn));
        };
      },

      handleGroupRemoved: (groupId, message) => {
        set((s) => ({
          groups:        s.groups.filter((g) => g.id !== groupId),
          activeGroupId: s.activeGroupId === groupId ? null : s.activeGroupId,
          activeGroup:   s.activeGroup?.id === groupId ? null : s.activeGroup,
          messages:      { ...s.messages,    [groupId]: undefined },
          pagination:    { ...s.pagination,  [groupId]: undefined },
          typingUsers:   { ...s.typingUsers, [groupId]: undefined },
          error:         message || "This group is no longer available.",
        }));
      },

      reset: () => set({
        groups: [], activeGroupId: null, activeGroup: null,
        messages: {}, pagination: {}, typingUsers: {}, onlineCounts: {},
        error: null,
      }),
    }),
    { name: "TutorCommunityStore" }
  )
);

export default useTutorCommunityStore;