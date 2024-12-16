import Button from "../components/button";
import Snackbar from "../components/snack_bar";
import StaffsFilters from "../components/staffs_filters";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthentication } from "../functions/authentication";
import { deleteStaffData, fetchStaffsData } from "../functions/database";

function StaffsDB() {
    const styles = {
        content: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "15px",
            margin: "50px",
        },
        title: {
            fontSize: "2em",
            color: "#2A4365",
        },
        table: {
            borderCollapse: "collapse",
            width: "100%",
        },
        th: {
            border: "1px solid #ddd",
            padding: "8px",
            backgroundColor: "#f2f2f2",
            textAlign: "center",
            fontSize: "17px",
            fontWeight: "500",
        },
        td: {
            border: "1px solid #ddd",
            fontSize: "15px",
            padding: "8px",
            textAlign: "center",
        },
        actionButton: {
            border: "none",
            background: "none",
            cursor: "pointer",
            margin: "0 5px",
        },
        icon: {
            fontSize: "1.2em",
            color: "#2A4365",
        },
        tableContainer: {
            overflowX: "auto",
            width: "100%",
            border: "3px solid #E2E8F0",
            borderRadius: "8px",
            padding: "10px",
        },
    };

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    useEffect(() => {
        async function initializeData() {
            try {
                const isAuthenticated = await checkAuthentication();
                if (!isAuthenticated) {
                    navigate("/");
                }
                const newData = await fetchStaffsData();
                if (newData) {
                    setData(newData);
                } else {
                    setSnackbarMessage("Failed to fetch staffs data.");
                    setSnackbarVisible(true);
                }
            } catch (error) {
                setSnackbarMessage("An error occurred while fetching data.");
                setSnackbarVisible(true);
            } finally {
                setIsLoading(false);
            }
        }

        initializeData();
    }, []);

    async function handleDelete(id) {
        try {
            const status = await deleteStaffData(id);
            if (status) {
                setData(prevData => prevData.filter(item => item.id !== id));
                setSnackbarMessage("Data is deleted successfully.");
                setSnackbarVisible(true);
            }
        } catch (error) {
            setSnackbarMessage("Unable to delete the data.")
            setSnackbarVisible(true)
        }
    }

    async function handleEdit(data) {
        navigate("/staff-form", { state: data })
    }

    function handleFilters(newData) {
        try {
            setData(newData)
            setSnackbarMessage("Filters applied successfully.")
            setSnackbarVisible(true)
        } catch (error) {
            setSnackbarMessage(error.message)
            setSnackbarVisible(true)
        }
    }

    if (isLoading) {
        return (
            <div>
                <p>Loading ...</p>
            </div>
        );
    }

    return (
        <div>
            <div style={styles.content}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <h1 style={styles.title}>Staffs Data</h1>
                    <div>
                        <Button name="Back to Home" onClick={() => navigate("/dashboard")} />
                        &nbsp;&nbsp;&nbsp;
                        <Button name="Add Staff" onClick={() => navigate("/staff-form", { state: {} })} />
                    </div>
                </div>
                <StaffsFilters onFilterApply={handleFilters} />
                {data.length > 0 ? (
                    <div style={styles.tableContainer}>
                        <p>No. of results: {data.length}</p><br />
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Position</th>
                                    <th style={styles.th}>Admin</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((staff, index) => (
                                    <tr key={index}>
                                        <td style={styles.td}>{staff.name}</td>
                                        <td style={styles.td}>{staff.email}</td>
                                        <td style={styles.td}>{staff.position}</td>
                                        <td style={styles.td}>{staff.admin ? "Yes" : "No"}</td>
                                        <td style={styles.td}>
                                            <button
                                                style={styles.actionButton}
                                                onClick={() => handleDelete(staff.id)}
                                            >
                                                <i className="fa fa-trash" style={styles.icon}></i>
                                            </button>
                                            <button
                                                style={styles.actionButton}
                                                onClick={() => handleEdit(staff)}
                                            >
                                                <i className="fa fa-edit" style={styles.icon}></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No data available.</p>
                )}
                {snackbarVisible && (
                    <Snackbar
                        message={snackbarMessage}
                        isVisible={snackbarVisible}
                        onClose={() => setSnackbarVisible(false)}
                    />
                )}
            </div>
        </div>
    );
}

export default StaffsDB;
