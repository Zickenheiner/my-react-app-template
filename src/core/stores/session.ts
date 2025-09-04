import { create } from 'zustand';

export interface ISessionStore {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const Store = create<ISessionStore>((set) => ({
  isConnected: false,
  connect: () => set({ isConnected: true }),
  disconnect: () => set({ isConnected: false }),
}));

export const SessionStore = () => {
  const isConnected = Store((s) => s.isConnected);
  const connect = Store((s) => s.connect);
  const disconnect = Store((s) => s.disconnect);

  return { isConnected, connect, disconnect };
};
