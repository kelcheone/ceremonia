import { GenerateKeysResponse } from "@/types/types";
import { create } from "zustand";

type File = GenerateKeysResponse;

type FileStore = {
  files: File[];
  setFiles: (files: File[]) => void;
  removeFile: (file: File) => void;
};

const useFileStore = create<FileStore>((set) => ({
  files: [],
  setFiles: (files) => set({ files }),
  removeFile: (file) =>
    set((state) => ({
      files: state.files.filter((f) => f.sessionId !== file.sessionId),
    })),
}));

export default useFileStore;
