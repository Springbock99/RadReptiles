// TradeModal.jsx
import React, { useState } from 'react';
import styles from "@/styles/Home.module.css";
import { InputModalTrade } from '@/interfaces';

const TradeModal: React.FC<InputModalTrade> = ({ isOpen, onClose, onTrade }) => {
    const [tokenIdRequest, setTokenIdRequest] = useState('');
    const [tokenIdOffer, setTokenIdOffer] = useState('');

    const [isTokenIdValid, setIsTokenIdValid] = useState(false);

    const handleTokenIdChangeRequest = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        const isValid = value === '' || ['0', '1', '2'].includes(value);
        setTokenIdRequest(value);
        setIsTokenIdValid(isValid);
    };

    const handleTokenIdChangeOffer = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        const isValid = value === '' || ['0', '1', '2'].includes(value);
        setTokenIdOffer(value);
        setIsTokenIdValid(isValid);
    };

    const handleSubmit = () => {
        if (isTokenIdValid) {
            onTrade(tokenIdRequest, tokenIdOffer);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <h2 className={styles.modalTitle}>Trade Tokens</h2>

                <div className={styles.errorText}>
                    Please enter a valid Token ID (0, 1, or 2).
                </div>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Requested Token"
                    value={tokenIdRequest}
                    onChange={handleTokenIdChangeRequest}
                />

<input
                    className={styles.input}
                    type="text"
                    placeholder="Offering Token"
                    value={tokenIdOffer}
                    onChange={handleTokenIdChangeOffer}
                />
                <div className={styles.buttonContainer}>
                    <button className={styles.submitButton} onClick={handleSubmit} disabled={!isTokenIdValid}>Trade</button>

                </div>
            </div>
        </div>
    );
};

export default TradeModal;
