import React from "react";

function Dropdown(props) {
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
        select: {
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
            <select style={styles.select} onChange={props.onChange} value={props.value}>
                {props.options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Dropdown;
