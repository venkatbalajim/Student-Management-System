import React, { useState, useEffect } from "react";
import Button from "../components/button";
import ActivityLogs from "../components/activity_logs";
import Snackbar from "../components/snack_bar";
import { useNavigate } from "react-router-dom";
import { checkAuthentication } from "../functions/authentication";
import { checkAdmin, fetchStaffsLogs, clearStaffsLogs } from "../functions/database";
import { formatDateTime, generateExcel } from "../functions/helpers";

function StaffsLogs() {
    const navigate = useNavigate();

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
        titleBar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
        },
        page: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            margin: "5%",
        },
    }

    const [logs, setLogs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const authStatus = await checkAuthentication();
                if (!authStatus) {
                    navigate("/");
                    return;
                }
                const [studentLogs, adminStatus] = await Promise.all([
                    fetchStaffsLogs(),
                    checkAdmin()
                ]);
                setLogs(studentLogs);
                setIsAdmin(adminStatus);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [])

    async function handleClearLogs() {
        try {
            setIsLoading(true)
            await clearStaffsLogs();
            setLogs([]);
            setSnackbarMessage("Staffs logs cleared successfully.");
            setSnackbarVisible(true);
        } catch (error) {
            setSnackbarMessage("Unable to clear staffs logs.");
            setSnackbarVisible(true);
        } finally {
            setIsLoading(false);
        }
    }

    function handleDownloadLogs() {
        try {
            setIsLoading(true);

            let finalLogs = logs.map(log => ({
                ...log,
                previous_data: JSON.parse(JSON.stringify(log.previous_data)),
                curr_data: JSON.parse(JSON.stringify(log.curr_data))
            }));

            for (let i = 0; i < finalLogs.length; i++) {
                const log = finalLogs[i];
                log.log_date = formatDateTime(log.log_date);
                log.previous_data = JSON.stringify(log.previous_data);
                log.curr_data = JSON.stringify(log.curr_data);
                finalLogs[i] = log;
            }

            const datetime = formatDateTime(new Date());
            generateExcel(finalLogs, `staffs-logs-${datetime}`);
            setSnackbarMessage("Excel downloaded successfully.");
            setSnackbarVisible(true);
        } catch (error) {
            console.error("Error downloading Excel file:", error);
            setSnackbarMessage("Unable to download Excel file.");
            setSnackbarVisible(true);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div>
                <p>Loading ...</p>
            </div>
        );
    } else if (!isAdmin) {
        return (
            <div style={styles.page}>
                <h1 style={styles.title}>Sorry, you are not authorized.</h1>
            </div>
        )
    }

    return (
        <div>
            <div style={styles.content}>
                <div style={styles.titleBar}>
                    <h1 style={styles.title}>Staffs Logs</h1>
                    <div>
                        <Button name="Back to Home" onClick={() => { navigate("/dashboard"); }} />
                        &nbsp;&nbsp;&nbsp;
                        <Button name="Download Logs" onClick={handleDownloadLogs} />
                        &nbsp;&nbsp;&nbsp;
                        <Button name="Clear Staffs Logs" onClick={handleClearLogs} />
                    </div>
                </div>
                <ActivityLogs logs={logs} type={1} />
            </div>
            {snackbarVisible && (
                <Snackbar message={snackbarMessage} isVisible={snackbarVisible} onClose={() => { setSnackbarVisible(false) }} />
            )}
        </div>
    )
}

export default StaffsLogs
