import React, { useState } from "react";

function DropdownWithTextField({ values = { condition: "", value: "" }, label, onChange, field }) {
    const [selectedOption, setSelectedOption] = useState(values.condition || "");
    const [textValue, setTextValue] = useState(values.value || "");

    const handleDropdownChange = (e) => {
        const option = e.target.value;
        setSelectedOption(option);
        if (onChange) {
            onChange({ condition: option, value: textValue }, field);
        }
    };

    const handleTextChange = (e) => {
        const value = e.target.value;
        setTextValue(value);
        if (onChange) {
            onChange({ condition: selectedOption, value }, field);
        }
    };

    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: "10px",
            width: "50%",
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
        },
        dropdown: {
            padding: "5px 10px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "2px solid grey",
        },
        innerContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
            width: "100%",
        },
    };

    return (
        <div style={styles.container}>
            <label style={styles.label}>{label}</label>
            <div style={styles.innerContainer}>
                <select
                    style={styles.dropdown}
                    value={selectedOption}
                    onChange={handleDropdownChange}
                >
                    <option value=""> </option>
                    <option value="Above">Above</option>
                    <option value="Below">Below</option>
                    <option value="Equal">Equal</option>
                </select>
                <input
                    style={styles.input}
                    type="text"
                    value={textValue}
                    onChange={handleTextChange}
                />
            </div>
        </div>
    );
}

export default DropdownWithTextField;
