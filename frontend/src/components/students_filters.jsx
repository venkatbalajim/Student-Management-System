import React, { useState } from "react";
import Button from "./button";
import Dropdown from "./dropdown";
import TextField from "./text_field";
import DropdownWithTextField from "./dropdown_text";
import { buildQueryString } from "../functions/helpers";
import { filterStudentsData } from "../functions/database";

function StudentsFilters({ onFilterApply }) {
    const genderOptions = ['', 'Male', 'Female', 'Other'];
    const degreeOptions = ['', 'B.E', 'B.Tech', 'M.E', 'M.Tech'];
    const yearOptions = ['', 1, 2, 3, 4];
    const departmentOptions = ['', 'BME', 'CSBS', 'CSE', 'CSE - AIDS', 'CSE - AIML', 'CSE - CZ', 'CVL', 'ECE', 'ECE - ACT', 'ECE - VLSI', 'EEE', 'IT', 'MECH', 'MCT', 'AE', 'ACT', 'CAD', 'VLSI'];
    const sectionOptions = ['', 'A', 'B', 'C', 'D'];
    const typeOptions = ['', 'Dayscholar', 'Hosteller'];

    const [filters, setFilters] = useState({
        name: "",
        gender: "",
        hosteller: "",
        email: "",
        phoneNo: "",
        address: "",
        register_number: "",
        degree: "",
        year: "",
        department: "",
        section: "",
        cgpa: { condition: "", value: "" },
        tenth_percent: { condition: "", value: "" },
        twelfth_percent: { condition: "", value: "" },
        standing_arrear: { condition: "", value: "" },
        history_arrear: { condition: "", value: "" },
        fees: { condition: "", value: "" },
        fees_due: "",
    });

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

    function handleDropdownTextChange(value, field) {
        const newValue = parseFloat(value.value);
        if (value.condition !== "" && !isNaN(newValue)) {
            setFilters((prev) => ({
                ...prev,
                [field]: {
                    condition: value.condition,
                    value: newValue,
                },
            }));
        }
    }

    async function handleApplyFilters() {
        try {
            const queryString = buildQueryString(filters);
            const filteredData = await filterStudentsData(queryString);
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
                <Dropdown
                    label="Gender"
                    options={genderOptions}
                    value={filters.gender}
                    onChange={(e) => handleChange(e.target.value, "gender")}
                />
                <Dropdown
                    label="Category"
                    options={typeOptions}
                    value={filters.hosteller}
                    onChange={(e) => handleChange(e.target.value, "hosteller")}
                />
                <TextField
                    label="Email"
                    type="email"
                    value={filters.email}
                    onChange={(e) => handleChange(e.target.value, "email")}
                />
            </div>
            <div style={styles.container}>
                <TextField
                    label="Phone No"
                    type="tel"
                    value={filters.phoneNo}
                    onChange={(e) => handleChange(e.target.value, "phoneNo")}
                />
                <TextField
                    label="Location"
                    type="text"
                    value={filters.address}
                    onChange={(e) => handleChange(e.target.value, "address")}
                />
                <TextField
                    label="Register No"
                    type="text"
                    value={filters.register_number}
                    onChange={(e) => handleChange(e.target.value, "register_number")}
                />
                <Dropdown
                    label="Degree"
                    options={degreeOptions}
                    value={filters.degree}
                    onChange={(e) => handleChange(e.target.value, "degree")}
                />
            </div>
            <div style={styles.container}>
                <Dropdown
                    label="Year"
                    options={yearOptions}
                    value={filters.year}
                    onChange={(e) => handleChange(e.target.value, "year")}
                />
                <Dropdown
                    label="Department"
                    options={departmentOptions}
                    value={filters.department}
                    onChange={(e) => handleChange(e.target.value, "department")}
                />
                <Dropdown
                    label="Section"
                    options={sectionOptions}
                    value={filters.section}
                    onChange={(e) => handleChange(e.target.value, "section")}
                />
                <DropdownWithTextField
                    label="CGPA"
                    value={filters.cgpa}
                    onChange={(value) => handleDropdownTextChange(value, "cgpa")}
                />
            </div>
            <div style={styles.container}>
                <DropdownWithTextField
                    label="10th Percent"
                    value={filters.tenth_percent}
                    onChange={(value) => handleDropdownTextChange(value, "tenth_percent")}
                />
                <DropdownWithTextField
                    label="12th Percent"
                    value={filters.twelfth_percent}
                    onChange={(value) => handleDropdownTextChange(value, "twelfth_percent")}
                />
                <DropdownWithTextField
                    label="Standing Arrear"
                    value={filters.standing_arrear}
                    onChange={(value) => handleDropdownTextChange(value, "standing_arrear")}
                />
                <DropdownWithTextField
                    label="History of Arrear"
                    value={filters.history_arrear}
                    onChange={(value) => handleDropdownTextChange(value, "history_arrear")}
                />
            </div>
            <div style={styles.container}>
                <DropdownWithTextField
                    label="Annual Fees"
                    value={filters.fees}
                    onChange={(value) => handleDropdownTextChange(value, "fees")}
                />
                <Dropdown
                    label="Fees Due"
                    options={['', 'Yes', 'No']}
                    value={filters.fees_due}
                    onChange={(e) => handleChange(e.target.value, "fees_due")}
                />
            </div>
            <br />
            <div style={styles.container}>
                <Button name="Apply Filters" onClick={handleApplyFilters} />
                <Button name="Reset Filters" onClick={handleResetFilters} />
            </div>
        </div>
    );
}

export default StudentsFilters;
