import React, { useEffect, useRef } from 'react';

const DeleteModal = ({ isOpen, onClose, onConfirm, invoiceNumber }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousFocusedElement = document.activeElement;
    const focusable = () =>
      modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) || [];

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const elements = [...focusable()];
        if (elements.length === 0) return;
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    const [firstElement] = focusable();
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      previousFocusedElement?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-lg max-w-sm w-full p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-modal-title" className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Confirm Deletion
        </h2>
        <p id="delete-modal-description" className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete invoice <strong>#{invoiceNumber}</strong>? This
          action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
