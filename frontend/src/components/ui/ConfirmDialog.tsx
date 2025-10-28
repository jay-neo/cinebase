// import { cn } from '~/lib/utils';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  // React.useEffect(() => {
  //   if (!isOpen) return;

  //   const handleEscape = (e: KeyboardEvent) => {
  //     if (e.key === 'Escape') {
  //       onClose();
  //     }
  //   };

  //   // Store original overflow and padding values
  //   const originalOverflow = document.body.style.overflow;
  //   const originalPaddingRight = document.body.style.paddingRight;
    
  //   // Calculate scrollbar width to prevent layout shift
  //   const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
  //   // Disable body scrolling
  //   document.body.style.overflow = 'hidden';
  //   if (scrollbarWidth > 0) {
  //     document.body.style.paddingRight = `${scrollbarWidth}px`;
  //   }
  //   document.addEventListener('keydown', handleEscape);

  //   return () => {
  //     document.removeEventListener('keydown', handleEscape);
  //     // Restore original values
  //     document.body.style.overflow = originalOverflow || '';
  //     document.body.style.paddingRight = originalPaddingRight || '';
  //   };
  // }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Dialog */}
      <div
        className="relative z-50 w-full max-w-md rounded-lg border border-border bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

