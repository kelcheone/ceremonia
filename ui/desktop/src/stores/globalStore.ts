import { create } from "zustand";

type GlobalStore = {
  error: string;
  success: string;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  errorModalOpen: boolean;
  setErrorModalOpen: (open: boolean) => void;
};

const useGlobalStore = create<GlobalStore>((set) => ({
  error: "",
  success: "",
  setError: (error) => set({ error }),
  setSuccess: (success) => set({ success }),
  errorModalOpen: false,
  setErrorModalOpen: (errorModalOpen) => set({ errorModalOpen }),
}));

export default useGlobalStore;
