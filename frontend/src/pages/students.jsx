import Button from "../components/button"
import Snackbar from "../components/snack_bar";
import StudentsFilters from "../components/students_filters"
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthentication } from "../functions/authentication"
import { deleteStudentData, fetchStudentsData } from "../functions/database";
import { formatDate } from "../functions/helpers";

function StudentsDB() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [data, setData] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const styles = {
        content: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "15px",
            margin: "50px",
        },
        page: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "5%",
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
            maxWidth: "100%",
            border: "3px solid #E2E8F0",
            borderRadius: "8px",
            padding: "10px",
        },
    };

    useEffect(() => {
        async function initializeData() {
            try {
                const isAuthenticated = await checkAuthentication();
                setIsAuthenticated(isAuthenticated);

                const newData = await fetchStudentsData();
                if (newData) {
                    setData(newData);
                } else {
                    setSnackbarMessage("Failed to fetch students data.");
                    setSnackbarVisible(true);
                }
            } catch (error) {
                setSnackbarMessage("An error occurred while fetching data.");
                setSnackbarVisible(true);
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, []);

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

    async function handleDelete(id) {
        try {
            const status = await deleteStudentData(id);
            if (status) {
                setData(prevData => prevData.filter(item => item.id !== id));
                setSnackbarMessage("Data is deleted successfully.");
                setSnackbarVisible(true);
            }
        } catch (error) {
            setSnackbarMessage("Failed to delete the data.");
            setSnackbarVisible(true);
        }
    }

    async function handleEdit(data) {
        navigate("/student-form", { state: data })
    }

    if (isLoading) {
        return (
            <div>
                <p>Loading ...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        navigate("/");
    }

    return (
        <div>
            <div style={styles.content}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <h1 style={styles.title}>Students Data</h1>
                    <div>
                        <Button name="Back to Home" onClick={() => { navigate("/dashboard"); }} />&nbsp;&nbsp;&nbsp;
                        <Button name="Add Student Data" onClick={() => { navigate("/student-form", { state: {} }) }} />
                    </div>
                </div>
                <StudentsFilters onFilterApply={handleFilters} />
                {isLoading ? (
                    <p>Loading...</p>
                ) : data.length > 0 ? (
                    <>
                        <div style={styles.tableContainer}>
                            <div>
                                <p>Number of results: {data.length}</p>
                                <br />
                            </div>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Name</th>
                                        <th style={styles.th}>Register No</th>
                                        <th style={styles.th}>Gender</th>
                                        <th style={styles.th}>Date of Birth</th>
                                        <th style={styles.th}>Personal Email</th>
                                        <th style={styles.th}>Student Mobile</th>
                                        <th style={styles.th}>Parent Mobile</th>
                                        <th style={styles.th}>Address</th>
                                        <th style={styles.th}>College Email</th>
                                        <th style={styles.th}>Degree</th>
                                        <th style={styles.th}>Year</th>
                                        <th style={styles.th}>Department</th>
                                        <th style={styles.th}>Section</th>
                                        <th style={styles.th}>Hosteller</th>
                                        <th style={styles.th}>CGPA</th>
                                        <th style={styles.th}>Standing Arrear</th>
                                        <th style={styles.th}>History of Arrear</th>
                                        <th style={styles.th}>10th Score (%)</th>
                                        <th style={styles.th}>12th Score (%)</th>
                                        <th style={styles.th}>Diploma</th>
                                        <th style={styles.th}>Fees</th>
                                        <th style={styles.th}>Fees Due</th>
                                        <th style={styles.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr key={index}>
                                            <td style={styles.td}>{item.name}</td>
                                            <td style={styles.td}>{item.register_number}</td>
                                            <td style={styles.td}>{item.gender}</td>
                                            <td style={styles.td}>
                                                {formatDate(item.date_of_birth)}
                                            </td>
                                            <td style={styles.td}>{item.personal_email}</td>
                                            <td style={styles.td}>{item.student_mobile}</td>
                                            <td style={styles.td}>{item.parent_mobile}</td>
                                            <td style={styles.td}>{item.address}</td>
                                            <td style={styles.td}>{item.college_email}</td>
                                            <td style={styles.td}>{item.degree}</td>
                                            <td style={styles.td}>{item.year}</td>
                                            <td style={styles.td}>{item.department}</td>
                                            <td style={styles.td}>{item.section}</td>
                                            <td style={styles.td}>{item.hosteller === 1 ? 'Yes' : 'No'}</td>
                                            <td style={styles.td}>{item.cgpa}</td>
                                            <td style={styles.td}>{item.standing_arrear}</td>
                                            <td style={styles.td}>{item.history_arrear}</td>
                                            <td style={styles.td}>{item.tenth_percent}</td>
                                            <td style={styles.td}>{item.twelfth_percent}</td>
                                            <td style={styles.td}>{(item.diploma !== null || item.diploma !== "") ? item.diploma : '-'}</td>
                                            <td style={styles.td}>{item.fees}</td>
                                            <td style={styles.td}>
                                                {Array.isArray(item.fees_due)
                                                    ? item.fees_due.map((fee, idx) => (
                                                        <div key={idx} style={{ display: 'flex', borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
                                                            <div style={{ flex: 1, paddingRight: '10px', textAlign: 'right' }}>
                                                                {idx + 1}
                                                            </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            <div style={{ flex: 2, textAlign: 'left' }}>
                                                                {fee}
                                                            </div>
                                                        </div>
                                                    ))
                                                    : item.fees_due}
                                            </td>
                                            <td style={styles.td}>
                                                <button
                                                    style={styles.actionButton}
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <i
                                                        className="fa fa-trash"
                                                        style={styles.icon}
                                                    ></i>
                                                </button>
                                                <button
                                                    style={styles.actionButton}
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <i
                                                        className="fa fa-edit"
                                                        style={styles.icon}
                                                    ></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <p>No data available.</p>
                )}
                {snackbarVisible && (
                    <Snackbar message={snackbarMessage} isVisible={snackbarVisible} onClose={() => { setSnackbarVisible(false) }} />
                )}
            </div>
        </div>
    );
}

export default StudentsDB;
