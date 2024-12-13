import React, { useEffect } from 'react';

function Snackbar({ message, isVisible, duration = 3000, onClose }) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const styles = {
        snackbar: {
            fontSize: '1rem',
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#323232',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '4px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            transform: isVisible
                ? 'translateX(-50%) translateY(0)'
                : 'translateX(-50%) translateY(20px)',
        },
    };

    return isVisible ? <div style={styles.snackbar}>
        <p>{message}</p>
    </div> : null;
}

export default Snackbar;
