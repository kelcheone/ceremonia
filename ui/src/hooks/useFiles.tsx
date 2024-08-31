import useFileStore from "@/stores/fileStore";
import { GenerateKeysResponse } from "@/types/types";

function useGetFiles() {
  const setFiles = useFileStore((state) => state.setFiles);
  if (typeof window === "undefined") {
    return [];
  }
  // get all the keys from local storage: they start with dkg-
  const keys = Object.keys(localStorage).filter((key) =>
    key.startsWith("dkg-")
  );
  let data = keys.map((key) => {
    return JSON.parse(localStorage.getItem(key) || "");
  });
  // check if the data has exceeded the expiration date (timestamp)
  const now = new Date().getTime();
  //remove the expired data from local storage
  data = data.filter((item) => {
    const expirationTime = new Date(item.expiration).getTime();
    if (expirationTime < now) {
      localStorage.removeItem(item.sessionId);
      return false;
    }
    return expirationTime > now;
  });

  // sort the data by date newest first
  data.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  setFiles(data);
}

const useDeleteFile = () => {
  const removeFile = useFileStore((state) => state.removeFile);
  return (file: GenerateKeysResponse) => {
    const key = `dkg-${file.sessionId}`;
    localStorage.removeItem(key);
    removeFile(file);
  };
};

export { useDeleteFile, useGetFiles };
