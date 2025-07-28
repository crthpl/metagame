import { useEffect } from "react";

type ModalProps = {
  onClose: () => void,
  children: React.ReactNode
}


export function Modal({onClose, children}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-modal bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" 
      onClick={onClose}
    >
      {/* Prevent clicks on content from closing modal */}
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}