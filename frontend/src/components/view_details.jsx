import React from "react";
import { formatDate } from "../functions/helpers";

function ViewDetails({ type, isOpen, onClose, data }) {
    const styles = {
        dialogOverlay: {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
        },
        dialogBox: {
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "scroll",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        },
        dialogTitle: {
            marginBottom: "10px",
            fontWeight: "bold",
        },
        closeButton: {
            backgroundColor: "#ff4d4f",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "5px",
        },
        splitter: {
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
        },
        dataBox: {
            flex: "1",
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "10px",
            backgroundColor: "#f9f9f9",
            overflowX: "auto",
        },
        tableData: {
            width: "100%",
            borderCollapse: "collapse",
        },
        thTd: {
            border: "1px solid #ddd",
            padding: "6px",
        },
        emptyData: {
            color: "#6a6c6e",
            fontStyle: "italic",
        },
    };

    let orderedKeys;
    if (type === 0) {
        orderedKeys = [
            "id",
            "name",
            "register_number",
            "gender",
            "date_of_birth",
            "address",
            "degree",
            "year",
            "department",
            "section",
            "personal_email",
            "college_email",
            "student_mobile",
            "parent_mobile",
            "tenth_percent",
            "twelfth_percent",
            "diploma",
            "cgpa",
            "fees",
            "fees_due",
            "hosteller",
            "history_arrear",
            "standing_arrear",
        ];
    } else {
        orderedKeys = [
            "id",
            "name",
            "email",
            "position",
            "admin",
        ]
    }

    const keyMappings = {
        id: "ID",
        cgpa: "CGPA",
        fees: "Fees",
        name: "Name",
        year: "Year",
        degree: "Degree",
        gender: "Gender",
        address: "Address",
        diploma: "Diploma",
        section: "Section",
        fees_due: "Fees Due",
        hosteller: "Category",
        department: "Department",
        college_email: "College Email",
        personal_email: "Personal Email",
        student_mobile: "Student Mobile",
        parent_mobile: "Parent Mobile",
        date_of_birth: "Date of Birth",
        tenth_percent: "10th Percent",
        twelfth_percent: "12th Percent",
        history_arrear: "History of Arrear",
        standing_arrear: "Standing Arrear",
        register_number: "Register No",
        email: "Email",
        position: "Position",
        admin: "Admin"
    };

    function categoryValue(value) {
        if (value === 0) {
            return "Dayscholar";
        } else {
            return "Hosteller";
        }
    }

    function renderDataTable(data) {
        if (typeof data === "string") {
            return <div style={styles.emptyData}>{data}</div>;
        }

        return (
            <table style={styles.tableData}>
                <thead>
                    <tr>
                        <th style={styles.thTd}>Field</th>
                        <th style={styles.thTd}>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {orderedKeys.map((key, index) => {
                        if (!(key in data)) return null;
                        const value = data[key];
                        return (
                            <tr key={index}>
                                <td style={styles.thTd}>{keyMappings[key]}</td>
                                <td style={styles.thTd}>
                                    {key === "date_of_birth" && value !== null
                                        ? formatDate(value)
                                        : key === "hosteller" && value !== null ?
                                            categoryValue(value) : value !== null
                                                ? value.toString()
                                                : ""}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }

    if (!isOpen) return null;

    return (
        <div style={styles.dialogOverlay}>
            <div style={styles.dialogBox}>
                <h3 style={styles.dialogTitle}>Data Details</h3>
                <div style={styles.splitter}>
                    <div style={styles.dataBox}>
                        <h4>Previous Data</h4>
                        <br />
                        {renderDataTable(data.prevData)}
                    </div>
                    <div style={styles.dataBox}>
                        <h4>Current Data</h4>
                        <br />
                        {renderDataTable(data.currData)}
                    </div>
                </div>
                <br />
                <button style={styles.closeButton} onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default ViewDetails;
