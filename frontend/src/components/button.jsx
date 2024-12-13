import React from "react"

function Button(props) {
    const styles = {
        backgroundColor: "#2873c9",
        color: "#fff",
        padding: '10px 20px',
        border: "none",
        borderRadius: "10px",
        fontSize: "1rem",
        cursor: "pointer"
    }

    return (
        <button style={styles} onClick={props.onClick}>{props.name}</button>
    )
}

export default Button;
