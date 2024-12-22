import React, { useEffect, useState } from "react";
import Button from "./button";
import { useNavigate } from "react-router-dom";
import { checkAdmin } from "../functions/database";

function NavBar() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        async function adminStatus() {
            try {
                const status = await checkAdmin();
                setIsAdmin(status);
            } catch (error) {
                console.error("Failed to fetch admin status:", error.message);
                setIsAdmin(false);
            }
        }

        adminStatus();
    }, []);

    const styles = {
        background: "#dceefa",
        padding: "20px",
        display: "flex",
        flexDirection: "row",
        gap: "5%",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        width: "100%",
    };

    const buttonList = [
        { label: "Students Data", route: "/students" },
        { label: "Activity Logs", route: "/student-logs" },
        { label: "Settings", route: "/settings" },
    ];

    if (isAdmin) {
        buttonList.push({ label: "Staffs Data", route: "/staffs" });
    }

    return (
        <div style={styles}>
            {buttonList.map((item) => (
                <Button name={item.label} onClick={() => navigate(item.route)} />
            ))}
        </div>
    );
}

export default NavBar;
