// TradeModal.jsx
import React, { useState } from 'react';
import styles from "@/styles/Home.module.css";
import { InputModalProps } from '@/interfaces';

const MintModal: React.FC<InputModalProps> = ({ isOpen, onClose, onTrade }) => {
    const [tokenId, setTokenId] = useState('');
    const [isTokenIdValid, setIsTokenIdValid] = useState(false);

    const handleTokenIdChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        const isValid = value === '' || ['0', '1', '2'].includes(value);
        setTokenId(value);
        setIsTokenIdValid(isValid);
    };

    

    const handleSubmit = () => {
        if (isTokenIdValid) {
            onTrade(tokenId);
            onClose();
        }
    };
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <h2 className={styles.modalTitle}>Mint Tokens</h2>

                <div className={styles.errorText}>
                    Please enter a valid Token ID (0, 1, or 2).
                </div>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Token ID (0, 1, or 2)"
                    value={tokenId}
                    onChange={handleTokenIdChange}
                />
                <div className={styles.buttonContainer}>
                    <button className={styles.submitButton} onClick={handleSubmit} disabled={!isTokenIdValid}>Mint</button>

                </div>
            </div>
        </div>
    );
};

export default MintModal;
