import React from "react";

function ActivityLogs() {
    const styles = {
        page: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            margin: "5%",
        },
        title: {
            fontSize: "2em",
            color: "#2A4365",
        },
    }

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>This is activity logs page.</h1>
        </div>
    );
}

export default ActivityLogs
