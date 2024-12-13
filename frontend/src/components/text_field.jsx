import React from "react"

function TextField(props) {
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: "start",
            width: "50%",
            gap: "10px",
        },
        label: {
            fontSize: "1rem",
            color: "#374151",
        },
        input: {
            padding: "5px 10px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "2px solid grey",
            width: "100%",
        }
    };

    return (
        <div style={styles.container}>
            <label style={styles.label}> {props.label} </label>
            <input style={styles.input} type={props.type} onChange={props.onChange} value={props.value} autoComplete="false" />
        </div>
    )
}

export default TextField;
