import { create } from "zustand";

interface IUserData {
  username?: string;
  email?: string;
  no_handphone?: string;
  is_verified?: number;
}

type State = {
  user: IUserData;
};

type Action = {
  setUser: (user: State) => void;
  reset: () => void;
};

const useUserStore = create<State & Action>((set) => ({
  user: { username: "", email: "", no_handphone: "" },
  setUser: (state: IUserData) => set({ user: state }),
  reset: () =>
    set({
      user: {
        username: undefined,
        email: undefined,
        no_handphone: undefined,
        is_verified: undefined,
      },
    }),
}));

export default useUserStore;
