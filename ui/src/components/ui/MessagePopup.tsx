import useGlobalStore from "@/stores/globalStore";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const MessagePopup = () => {
  const {
    error,
    success,
    setError,
    setSuccess,
    errorModalOpen,
    setErrorModalOpen,
  } = useGlobalStore();

  // check if error or success message is present
  const isError = error !== "";
  const isSuccess = success !== "";

  const message = isError ? error : success;
  const isOpen = isError || isSuccess;

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSuccess) {
      setSuccess("");
    } else {
      setError("");
    }
    setErrorModalOpen(false);
  };

  return (
    <div
      className={`fixed bottom-5 right-5 flex flex-row gap-2 items-center p-4 shadow-md rounded-md ${
        isSuccess ? "bg-green-400" : "bg-red-400"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {isSuccess ? (
            <CheckCircle size={20} className="text-black" />
          ) : (
            <AlertTriangle size={20} className="text-black" />
          )}
        </div>

        <div>
          <p className="text-sm leading-5 text-black">{message}</p>
        </div>
      </div>
      <button
        className="btn btn-sm btn-outline btn-circle text-black"
        onClick={handleClose}
      >
        <XCircle size={20} />
      </button>
    </div>
  );
};

export default MessagePopup;
