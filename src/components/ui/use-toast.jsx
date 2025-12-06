import * as React from "react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 10000; // 1 minute

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let memoryState = { toasts: [] };
const listeners = [];

// Unique ID generator
function genId() {
  return crypto.randomUUID();
}

// Dispatch function
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

// Reducer
export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    default:
      return state;
  }
};

// Show a toast
export function toast(props) {
  const id = genId();
  const createdAt = Date.now();

  // Add toast
  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: { ...props, id, createdAt, progress: 100 },
  });

  // Auto-remove after 1 minute
  setTimeout(() => {
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId: id });
  }, TOAST_REMOVE_DELAY);

  return {
    id,
    dismiss: () => dispatch({ type: actionTypes.REMOVE_TOAST, toastId: id }),
  };
}

// Hook to use toast state
export function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);

    // Progress updater
    const interval = setInterval(() => {
      const now = Date.now();
      memoryState.toasts.forEach((t) => {
        const elapsed = now - t.createdAt;
        const remaining = Math.max(0, TOAST_REMOVE_DELAY - elapsed);
        const progress = (remaining / TOAST_REMOVE_DELAY) * 100;

        dispatch({
          type: actionTypes.UPDATE_TOAST,
          toast: { id: t.id, progress },
        });
      });
    }, 100);

    return () => {
      clearInterval(interval);
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (id) => dispatch({ type: actionTypes.REMOVE_TOAST, toastId: id }),
  };
}
