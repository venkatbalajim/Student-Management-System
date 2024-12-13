import React from "react";

function ActivityLogs(props) {
    const { logs } = props;

    const styles = {
        container: {
            width: '100%',
            padding: '20px',
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            overflowY: 'auto',
            maxHeight: '80vh',
            border: "3px solid #E2E8F0",
        },
        log: {
            marginBottom: '10px',
            fontSize: '16px',
            lineHeight: '1.5',
        },
        divider: {
            margin: '10px 0',
            border: 'none',
            borderTop: '1px solid #ddd',
        },
        empty: {
            color: "#6a6c6e",
        }
    };

    return (
        <div style={styles.container}>
            {logs && logs.length > 0 ? (
                logs.map((log, index) => (
                    <div key={index}>
                        <div style={styles.log}>{log}</div>
                        {index < logs.length - 1 && <hr style={styles.divider} />}
                    </div>
                ))
            ) : (
                <div style={styles.empty}>No activity logs available.</div>
            )}
        </div>
    );
}

export default ActivityLogs;
