import React, { ReactNode, useEffect } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Store original overflow and padding values
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Disable body scrolling
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore original values
      document.body.style.overflow = originalOverflow || '';
      document.body.style.paddingRight = originalPaddingRight || '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 md:py-6">
      <div
        className="fixed inset-0 bg-gray-800 opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative bg-white p-5 md:p-10 md:rounded-lg shadow-lg w-full h-full max-w-full md:max-w-2xl md:max-h-full md:h-auto overflow-auto">
        {/* Close Button */}
        <button
          className="absolute top-2 right-5 font-bold text-gray-600 hover:text-gray-900 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="relative mt-8">
          <h2 className="text-2xl font-semibold text-center mb-4">{title}</h2>
          <div className="mb-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;