import React from "react";

function DatePicker(props) {
    const currentDate = new Date().toISOString().split("T")[0];

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
        datePicker: {
            padding: "5px 10px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "2px solid grey",
            width: "100%",
        }
    };

    return (
        <div style={styles.container}>
            <label style={styles.label}>{props.label}</label>
            <input
                type="date"
                style={styles.datePicker}
                value={props.value}
                onChange={props.onChange}
                max={currentDate}
                required
            />
        </div>
    );
}

export default DatePicker;
