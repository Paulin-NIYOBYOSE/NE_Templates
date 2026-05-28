"use client";

import { useState, useCallback } from "react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
}

interface ConfirmModalState extends ConfirmOptions {
  isOpen: boolean;
  resolve?: (value: boolean) => void;
}

export function useConfirmModal() {
  const [modal, setModal] = useState<ConfirmModalState>({
    isOpen: false,
    message: "",
  });

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setModal({ ...options, isOpen: true, resolve });
      });
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    modal.resolve?.(true);
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, [modal]);

  const handleCancel = useCallback(() => {
    modal.resolve?.(false);
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, [modal]);

  const variantStyles = {
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    warning: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    primary: "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500",
  };

  const iconColors = {
    danger: "text-red-600",
    warning: "text-yellow-600",
    primary: "text-primary-600",
  };

  const ModalComponent = modal.isOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-slide-in">
        <div className="flex items-start gap-4">
          <div className={`shrink-0 ${iconColors[modal.variant || "primary"]}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {modal.title || "Confirm Action"}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{modal.message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {modal.cancelText || "Cancel"}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantStyles[modal.variant || "primary"]}`}
          >
            {modal.confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, ModalComponent };
}
