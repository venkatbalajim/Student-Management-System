import React, { useState, useEffect } from "react";
import Button from "../components/button";
import ActivityLogs from "../components/activity_logs"
import { useNavigate } from "react-router-dom";
import { checkAuthentication } from "../functions/authentication";
import { fetchStudentsLogs } from "../functions/database";

function StudentsLogs() {
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
    }

    const [logs, setLogs] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const authStatus = await checkAuthentication();
                if (!authStatus) {
                    navigate("/");
                }
                const studentLogs = await fetchStudentsLogs();
                setLogs(studentLogs);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false)
            }
        }
        fetchData();
    }, [])

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
                    <h1 style={styles.title}>Students Data</h1>
                    <div>
                        <Button name="Back to Home" onClick={() => { navigate("/dashboard") }} />&nbsp;&nbsp;&nbsp;
                        <Button name="Clear Students Logs" onClick={() => { }} />&nbsp;&nbsp;&nbsp;
                        <Button name="View Staff Logs" onClick={() => { }} />
                    </div>
                </div>
                <ActivityLogs logs={logs} />
            </div>
        </div>
    );
}

export default StudentsLogs
