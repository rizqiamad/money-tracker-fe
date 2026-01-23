import { create } from "zustand";

interface IUserData {
  username?: string;
  email?: string;
  no_handphone?: string;
}

type State = {
  user: IUserData;
};

type Action = {
  setUser: (user: State) => void;
};

const useUserStore = create<State & Action>((set) => ({
  user: { username: "", email: "", no_handphone: "" },
  setUser: (state: IUserData) => set({ user: state }),
}));

export default useUserStore;
