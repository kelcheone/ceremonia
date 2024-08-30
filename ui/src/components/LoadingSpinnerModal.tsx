const LoadingSpinnerModal = ({ message }: { message?: string }) => {
  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-accent/10 bg-opacity-50 flex items-center justify-center">
      <div className="flex justify-center items-center flex-col bg-transparent p-2 rounded-md">
        <div
          className="animate-spin rounded-full h-32 w-32 border-b-4
          border-gradient border-t-4 border-t-accent border-b-success "
        ></div>
        <h3 className="text-info font-bold animate-ping mt-2">{message} </h3>
      </div>
    </div>
  );
};

export default LoadingSpinnerModal;
