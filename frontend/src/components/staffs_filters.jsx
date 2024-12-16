import React, { useState } from "react";
import Button from "./button";
import Dropdown from "./dropdown";
import TextField from "./text_field";
import { buildQueryString } from "../functions/helpers";
import { filterStaffsData } from "../functions/database";

function StaffsFilters({ onFilterApply }) {
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        position: "",
        admin: "",
    })

    const styles = {
        container: {
            display: "flex",
            flexWrap: "no-wrap",
            gap: "20px",
            justifyContent: "flex-start",
            marginBottom: "20px",
        },
        item: {
            flex: "1 1 calc(30% - 20px)",
        },
        filtersContainer: {
            width: "100%",
            boxSizing: "border-box",
            border: "3px solid #E2E8F0",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
        },
    };

    function handleChange(value, field) {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function handleApplyFilters() {
        try {
            const queryString = buildQueryString(filters);
            const filteredData = await filterStaffsData(queryString);
            onFilterApply(filteredData);
        } catch (error) {
            console.error("Error applying filters:", error.message);
        }
    }

    function handleResetFilters() {
        window.location.reload()
    }

    return (
        <div style={styles.filtersContainer}>
            <div style={styles.container}>
                <TextField
                    label="Name"
                    type="text"
                    value={filters.name}
                    onChange={(e) => handleChange(e.target.value, "name")}
                />
                <TextField
                    label="Email"
                    type="email"
                    value={filters.email}
                    onChange={(e) => handleChange(e.target.value, "email")}
                />
                <TextField
                    label="Position"
                    type="text"
                    value={filters.position}
                    onChange={(e) => handleChange(e.target.value, "position")}
                />
                <Dropdown
                    label="Admin"
                    options={["", "Yes", "No"]}
                    value={filters.admin}
                    onChange={(e) => handleChange(e.target.value, "admin")}
                />
            </div>
            <br />
            <div style={styles.container}>
                <Button name="Apply Filters" onClick={handleApplyFilters} />
                <Button name="Reset Filters" onClick={handleResetFilters} />
            </div>
        </div>
    )
}

export default StaffsFilters
