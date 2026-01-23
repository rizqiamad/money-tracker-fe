import { create } from "zustand";

type State = {
  id?: string;
  username?: string;
  email?: string;
};

type Action = {
  setUser: (user: State) => void;
};

const useUserStore = create<State & Action>((set) => ({
  id: "",
  username: "",
  email: "",
  setUser: (user: State) =>
    set(() => ({ id: user.id, username: user.username, email: user.username })),
}));

export default useUserStore;
