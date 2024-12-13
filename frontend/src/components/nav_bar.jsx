import React from "react";
import Button from "./button";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../functions/authentication";

function NavBar() {
    const navigate = useNavigate();
    const logout = useLogout();

    const styles = {
        background: "#dceefa",
        padding: "20px",
        display: "flex",
        flexDirection: "row",
        gap: "5%",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        width: "100%"
    }

    return (
        <div style={styles}>
            <Button name="Database" onClick={() => { navigate("/students") }} />
            <Button name="Activity Logs" onClick={() => { navigate("/students-logs") }} />
            <Button name="Settings" onClick={() => { navigate("/settings") }} />
        </div>
    )
}

export default NavBar
