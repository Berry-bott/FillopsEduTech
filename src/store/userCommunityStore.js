// src/store/communityStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getSocket, joinGroup, leaveGroup, sendGroupMessage, startGroupTyping, stopGroupTyping } from "@/lib/communitySocketService";

const BASE_URL = "https://fillops-server-5fuf.onrender.com";

const getAuthToken = () => useAuthStore.getState().accessToken || null;

// ──────────────────────────────────────────────────────────────────────
// COMMUNITY STORE
// ──────────────────────────────────────────────────────────────────────
const useCommunityStore = create(
  devtools(
    (set, get) => ({
      // ── State ───────────────────────────────────────────────────────
      groups: [],                     // Array<Group>
      activeGroupId: null,
      activeGroup: null,              // current detailed group object

      messages: {},                   // { [groupId]: Message[] }
      pagination: {},                 // { [groupId]: { hasMore, nextCursor } }

      typingUsers: {},                // { [groupId]: Map<userId, userName> }
      onlineCounts: {},               // { [groupId]: number }

      loadingGroups: false,
      loadingMessages: false,
      loadingOlder: false,
      sendingMessage: false,
      error: null,

      typingTimeout: null,            // for auto-stop typing

      // ── Auth / Token ────────────────────────────────────────────────
      // Token is now read from auth store on demand

      // ── Groups ──────────────────────────────────────────────────────
      fetchGroups: async () => {
        const token = getAuthToken();
        if (!token) return set({ error: "Not authenticated" });

        set({ loadingGroups: true, error: null });

        try {
          const res = await fetch(`${BASE_URL}/api/community/groups`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const { data: groups = [] } = await res.json();

          const onlineCounts = {};
          groups.forEach(g => { onlineCounts[g.id] = g.onlineCount || 0; });

          set({ groups, onlineCounts, loadingGroups: false });
        } catch (err) {
          set({ error: "Failed to load groups", loadingGroups: false });
        }
      },

      fetchGroupDetails: async (groupId) => {
        const token = getAuthToken();
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

      // ── Open / Close Group ──────────────────────────────────────────
      openGroup: async (groupId) => {
        const { activeGroupId } = get();

        // Leave previous room
        if (activeGroupId && activeGroupId !== groupId) {
          leaveGroup(activeGroupId);
          get().stopTyping();
        }

        set({
          activeGroupId: groupId,
          activeGroup: null,
          messages: { ...get().messages, [groupId]: get().messages[groupId] || [] },
          typingUsers: { ...get().typingUsers, [groupId]: new Map() },
        });

        // Load data
        await Promise.all([
          get().fetchGroupDetails(groupId),
          get().fetchMessages(groupId), // always refresh on open (or check cache if desired)
        ]);

        // Join socket room
        const socket = getSocket();
        if (socket?.connected) {
          joinGroup(groupId, (res) => {
            if (res?.success) {
              set(state => ({
                onlineCounts: { ...state.onlineCounts, [groupId]: res.onlineCount }
              }));
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

      // ── Messages ────────────────────────────────────────────────────
      fetchMessages: async (groupId, cursor = null) => {
        const token = getAuthToken();
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

          set(state => ({
            messages: {
              ...state.messages,
              [groupId]: isOlder
                ? [...newMsgs, ...(state.messages[groupId] || [])]
                : newMsgs,
            },
            pagination: {
              ...state.pagination,
              [groupId]: pagination,
            },
            loadingMessages: false,
            loadingOlder: false,
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

      sendMessage: async (content) => {
        const { activeGroupId } = get();
        if (!activeGroupId || !content?.trim()) return;

        const trimmed = content.trim();
        set({ sendingMessage: true });

        const socket = getSocket();

        if (socket?.connected) {
          sendGroupMessage(
            { groupId: activeGroupId, content: trimmed, type: "TEXT" },
            (ack) => {
              set({ sendingMessage: false });
              if (!ack?.success) {
                set({ error: ack?.message || "Failed to send" });
              }
            }
          );
          get().stopTyping();
        } else {
          // REST fallback
          const token = getAuthToken();
          try {
            await fetch(`${BASE_URL}/api/community/groups/${activeGroupId}/messages`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ content: trimmed, type: "TEXT" }),
            });
          } catch {
            set({ error: "No connection — message not sent" });
          }
          set({ sendingMessage: false });
        }
      },

      // ── Typing ──────────────────────────────────────────────────────
      startTyping: () => {
        const { activeGroupId, typingTimeout } = get();
        if (!activeGroupId) return;

        startGroupTyping(activeGroupId);

        if (typingTimeout) clearTimeout(typingTimeout);
        set({
          typingTimeout: setTimeout(() => get().stopTyping(), 2500),
        });
      },

      stopTyping: () => {
        const { activeGroupId, typingTimeout } = get();
        if (typingTimeout) clearTimeout(typingTimeout);
        if (activeGroupId) stopGroupTyping(activeGroupId);
        set({ typingTimeout: null });
      },

      // ── Socket Listeners Registration ───────────────────────────────
      initializeListeners: () => {
        const socket = getSocket();
        if (!socket) return;

        const handlers = {
          "group:new_message": (msg) => {
            set(state => ({
              messages: {
                ...state.messages,
                [msg.groupId]: [...(state.messages[msg.groupId] || []), msg],
              },
              groups: state.groups.map(g =>
                g.id === msg.groupId ? { ...g, lastMessage: msg } : g
              ),
            }));
          },

          "group:typing": (data) => {
            const groupId = data.groupId || get().activeGroupId;
            if (!groupId) return;

            set(state => {
              const map = new Map(state.typingUsers[groupId] || []);
              if (data.isTyping) {
                map.set(data.userId, data.userName);
              } else {
                map.delete(data.userId);
              }
              return {
                typingUsers: { ...state.typingUsers, [groupId]: map },
              };
            });
          },

          "group:member_count": (data) => {
            if (data.groupId) {
              set(state => ({
                onlineCounts: { ...state.onlineCounts, [data.groupId]: data.count },
              }));
            }
          },

          "group:user_joined": (data) => {
            if (data.groupId) {
              set(state => ({
                onlineCounts: { ...state.onlineCounts, [data.groupId]: data.onlineCount },
              }));
            }
          },

          "group:user_left": (data) => {
            if (data.groupId) {
              set(state => ({
                onlineCounts: { ...state.onlineCounts, [data.groupId]: data.onlineCount },
              }));
            }
          },

          "group:deactivated": (data) => {
            get().handleGroupRemoved(data.groupId, data.message);
          },

          "group:deleted": (data) => {
            get().handleGroupRemoved(data.groupId, data.message);
          },
        };

        // Register all
        Object.entries(handlers).forEach(([event, fn]) => {
          socket.on(event, fn);
        });

        // Return cleanup function
        return () => {
          Object.keys(handlers).forEach(event => socket.off(event, handlers[event]));
        };
      },

      // ── Group removal handler ───────────────────────────────────────
      handleGroupRemoved: (groupId, message) => {
        set(state => ({
          groups: state.groups.filter(g => g.id !== groupId),
          activeGroupId: state.activeGroupId === groupId ? null : state.activeGroupId,
          activeGroup: state.activeGroup?.id === groupId ? null : state.activeGroup,
          messages: { ...state.messages, [groupId]: undefined },
          pagination: { ...state.pagination, [groupId]: undefined },
          typingUsers: { ...state.typingUsers, [groupId]: undefined },
          error: message || "This group is no longer available.",
        }));
      },

      // ── Reset / cleanup ─────────────────────────────────────────────
      reset: () => {
        set({
          groups: [],
          activeGroupId: null,
          activeGroup: null,
          messages: {},
          pagination: {},
          typingUsers: {},
          onlineCounts: {},
          error: null,
        });
      },
    }),
    { name: "CommunityStore" }
  )
);

// Optional: auto-register listeners on first import (or call manually after login)
if (typeof window !== "undefined") {
  useCommunityStore.getState().initializeListeners();
}

export default useCommunityStore;