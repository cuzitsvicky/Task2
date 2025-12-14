const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-black border border-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">{title || 'Confirm Action'}</h3>
        <p className="text-white mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;

