import NavBar from "../components/nav_bar";
import ActivityLogs from "../components/activity_logs";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryCard, SecondaryCard } from "../components/count_cards";
import { checkAuthentication } from "../functions/authentication";
import { fetchLogs, fetchMajorCount, fetchPGDeptCount, fetchUGDeptCount, fetchUserName } from "../functions/database";

function Dashboard() {
    const navigate = useNavigate();

    const styles = {
        content: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "20px",
            margin: "50px",
        },
        title: {
            fontSize: "2em",
            color: "#2A4365",
        },
        cardsContainer: {
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "20px",
        },
        primaryCardsRow: {
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            gap: "20px",
        },
        secondaryCardsRow: {
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "20px",
        },
    };

    const [name, setName] = useState("Guest")
    const [majorCount, setMajorCount] = useState(['-', '-', '-'])
    const [deptCount, setDeptCount] = useState(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'])
    const [pgDeptCount, setPGDeptCount] = useState(['-', '-', '-', '-', '-'])
    const [logs, setLogs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        async function fetchData() {
            try {
                const authStatus = await checkAuthentication();
                if (authStatus) {
                    setIsAuthenticated(authStatus);
                } else {
                    return;
                }

                const [userName, majorCounts, ugDeptCounts, pgDeptCounts, activityLogs] = await Promise.all([
                    fetchUserName(),
                    fetchMajorCount(),
                    fetchUGDeptCount(),
                    fetchPGDeptCount(),
                    fetchLogs(),
                ]);

                setName(prev => userName || prev);
                setMajorCount(prev => majorCounts || prev);
                setDeptCount(prev => ugDeptCounts || prev);
                setPGDeptCount(prev => pgDeptCounts || prev);
                setLogs(prev => activityLogs || prev);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            navigate("/");
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return (
            <div>
                <p>Loading ...</p>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <div style={styles.content}>
                <h1 style={styles.title}>Welcome, {name}</h1>
                <div style={styles.cardsContainer}>
                    <div style={styles.primaryCardsRow}>
                        <PrimaryCard count={majorCount[0] || "-"} label="Overall Students" />
                        <PrimaryCard count={majorCount[1] || "-"} label="UG Students" />
                        <PrimaryCard count={majorCount[2] || "-"} label="PG Students" />
                    </div>
                </div>
                <br />
                <h1 style={styles.title}>UG Departments</h1>
                <div style={styles.cardsContainer}>
                    <div style={styles.secondaryCardsRow}>
                        <SecondaryCard count={deptCount[0]} label="B.E BME" />
                        <SecondaryCard count={deptCount[1]} label="B.E CSBS" />
                        <SecondaryCard count={deptCount[2]} label="B.E CSE" />
                        <SecondaryCard count={deptCount[3]} label="B.E CSE (AIDS)" />
                        <SecondaryCard count={deptCount[4]} label="B.E CSE (AIML)" />
                        <SecondaryCard count={deptCount[5]} label="B.E CSE (CZ)" />
                        <SecondaryCard count={deptCount[6]} label="B.E CVL" />
                        <SecondaryCard count={deptCount[7]} label="B.E ECE" />
                        <SecondaryCard count={deptCount[8]} label="B.E ECE (ACT)" />
                        <SecondaryCard count={deptCount[9]} label="B.E ECE (VLSI)" />
                        <SecondaryCard count={deptCount[10]} label="B.E EEE" />
                        <SecondaryCard count={deptCount[11]} label="B.Tech IT" />
                        <SecondaryCard count={deptCount[12]} label="B.E MECH" />
                        <SecondaryCard count={deptCount[13]} label="B.E MCT" />
                    </div>
                </div>
                <br />
                <h1 style={styles.title}>PG Departments</h1>
                <div style={styles.cardsContainer}>
                    <div style={styles.secondaryCardsRow}>
                        <SecondaryCard count={pgDeptCount[0]} label="M.E AE" />
                        <SecondaryCard count={pgDeptCount[1]} label="M.E ACT" />
                        <SecondaryCard count={pgDeptCount[2]} label="M.E CAD" />
                        <SecondaryCard count={pgDeptCount[3]} label="M.E CSE" />
                        <SecondaryCard count={pgDeptCount[4]} label="M.E VLSI" />
                    </div>
                </div>
                <br />
                <h1 style={styles.title}>Recent Activity Logs</h1>
                <ActivityLogs logs={logs} />
            </div>
        </div>
    );
}

export default Dashboard;
