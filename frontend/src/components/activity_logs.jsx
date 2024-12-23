import React, { useState } from "react";
import ViewDetails from "../components/view_details";
import { formatDateTime } from "../functions/helpers";

function ActivityLogs({ logs, type }) {
    const [dialogData, setDialogData] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const styles = {
        container: {
            width: "100%",
            boxSizing: "border-box",
        },
        table: {
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
        },
        th: {
            border: "1px solid #ddd",
            padding: "8px",
            backgroundColor: "#f0f0f0",
            textAlign: "left",
        },
        td: {
            border: "1px solid #ddd",
            padding: "8px",
        },
        button: {
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "5px",
        },
    };

    function isEmptyObject(obj) {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    };

    function openDialog(prevData, currData) {
        const resolvedPrevData = isEmptyObject(prevData) ? "No data available" : prevData;
        const resolvedCurrData = isEmptyObject(currData) ? "No data available" : currData;
        setDialogData({ prevData: resolvedPrevData, currData: resolvedCurrData });
        setIsDialogOpen(true);
    };

    function closeDialog() {
        setIsDialogOpen(false);
        setDialogData(null);
    };

    return (
        <div style={styles.container}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Date and Time</th>
                        <th style={styles.th}>Log ID</th>
                        <th style={styles.th}>{type === 0 ? "Student ID" : "Account ID"}</th>
                        <th style={styles.th}>{type === 0 ? "Staff ID" : "Admin ID"}</th>
                        <th style={styles.th}>{type === 0 ? "Staff Name" : "Admin Name"}</th>
                        <th style={styles.th}>Action</th>
                        <th style={styles.th}>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {logs && logs.length > 0 ? (
                        logs.map((log, index) => (
                            <tr key={index}>
                                <td style={styles.td}>{formatDateTime(log.log_date)}</td>
                                <td style={styles.td}>{log.log_id}</td>
                                <td style={styles.td}>{type === 0 ? log.student_id : log.account_id}</td>
                                <td style={styles.td}>{log.staff_id}</td>
                                <td style={styles.td}>{log.staff_name}</td>
                                <td style={styles.td}>{log.action}</td>
                                <td style={styles.td}>
                                    <button
                                        style={styles.button}
                                        onClick={() =>
                                            openDialog(
                                                log.previous_data || "No data available",
                                                log.curr_data || "No data available"
                                            )
                                        }
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ ...styles.td, textAlign: "center" }}>
                                No activity logs available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <ViewDetails type={type} isOpen={isDialogOpen} onClose={closeDialog} data={dialogData} />
        </div>
    );
}

export default ActivityLogs;
