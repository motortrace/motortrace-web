import React from 'react';
import { createPortal } from 'react-dom';
import './ConfirmationDialog.scss';

interface ConfirmationDialogProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    message,
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleOverlayClick = () => {
        onCancel();
    };

    const handleDialogClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return createPortal(
        <div className="confirmation-dialog-overlay" onClick={handleOverlayClick}>
            <div className="confirmation-dialog-container" onClick={handleDialogClick}>
                <p className="confirmation-dialog-message">{message}</p>
                <div className="confirmation-dialog-buttons">
                    <button
                        className="confirmation-dialog-button confirmation-dialog-button-no"
                        onClick={handleCancel}
                    >
                        No
                    </button>
                    <button
                        className="confirmation-dialog-button confirmation-dialog-button-yes"
                        onClick={handleConfirm}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationDialog;
