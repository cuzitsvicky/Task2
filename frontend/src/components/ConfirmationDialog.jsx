const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-black border border-white rounded-xl p-4 sm:p-6 max-w-md w-full shadow-lg">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{title || 'Confirm Action'}</h3>
        <p className="text-sm sm:text-base text-white mb-4 sm:mb-6 break-words">{message}</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200 touch-manipulation text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200 touch-manipulation text-sm sm:text-base"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;

