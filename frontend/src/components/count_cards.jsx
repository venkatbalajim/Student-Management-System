import React from "react";

function PrimaryCard(props) {
    const styles = {
        card: {
            padding: "20px",
            background: "#2873c9",
            color: "#fff",
            borderRadius: "10px",
            textAlign: "center",
            flex: "1",
            minWidth: "300px",
        },
        count: {
            fontSize: "2em",
            fontWeight: "bold",
        },
        label: {
            fontSize: "1.2em",
        },
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.count}>{props.count}</h2>
            <p style={styles.label}>{props.label}</p>
        </div>
    );
}

function SecondaryCard(props) {
    const styles = {
        card: {
            padding: "15px",
            background: "#F7FAFC",
            color: "#2A4365",
            border: "3px solid #E2E8F0",
            borderRadius: "10px",
            textAlign: "center",
            flex: "1",
            minWidth: "200px",
        },
        count: {
            fontSize: "1.5em",
            fontWeight: "bold",
        },
        label: {
            fontSize: "1em",
        },
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.count}>{props.count}</h2>
            <p style={styles.label}>{props.label}</p>
        </div>
    );
}

export { PrimaryCard, SecondaryCard };
