import { create } from "zustand";

type GenerateKeysForm = {
  validators: number;
  withdrawalAddress: string;
};
type GeneratorStore = {
  FormData: GenerateKeysForm;
  isLoading: boolean;
  setIsLoading: () => void;
  setFormData: (data: GenerateKeysForm) => void;
};

export const useGeneratorStore = create<GeneratorStore>((set, get) => ({
  FormData: {
    validators: 0,
    withdrawalAddress: "",
  },
  isLoading: false,
  setIsLoading: () => set({ isLoading: !get().isLoading }),
  setFormData: (data) => set({ FormData: data }),
}));
