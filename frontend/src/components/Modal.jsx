import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, title, message, type, children }) => {
  if (!isOpen) {
    return null;
  }

  // >>>>>> DEBUGGER PLACEMENT: PAUSE HERE <<<<<<
  // This log confirms the modal component receives isOpen=true
  console.log("Modal Component: `isOpen` prop is TRUE. Checking DOM..."); 
  // debugger; // You can keep this or remove it once the issue is resolved

  // Stop propagation to prevent clicks on the modal content from closing the modal
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto relative transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        onClick={handleModalContentClick}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {children ? (
          <div>{children}</div>
        ) : (
          // This is the line that will now display the message correctly
          <p className="text-sm text-gray-700 mb-4">{message}</p> 
        )}

        {type === 'confirm' && !children && (
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className="btn-primary px-4 py-2"
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
