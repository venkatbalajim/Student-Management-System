import React from "react";

function NotFound() {
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
            <h1 style={styles.title}>404 Not Found.</h1>
        </div>
    );
}

export default NotFound;
