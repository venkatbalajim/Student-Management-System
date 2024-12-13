import Button from "../components/button";
import TextField from "../components/text_field";
import Snackbar from "../components/snack_bar"
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthentication, fetchPassword, updatePassword, useLogout } from "../functions/authentication";

function Settings() {
    const navigate = useNavigate();
    const logout = useLogout();

    const [isLoading, setIsLoading] = useState(true);
    const [password, setPassword] = useState("")
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [reenteredPassword, setReenteredPassword] = useState("");
    const [oldPasswordMessage, setOldPasswordMessage] = useState("");
    const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    useEffect(() => {
        async function checkStatus() {
            const authStatus = await checkAuthentication();
            if (authStatus) {
                const fetchedPassword = await fetchPassword();
                setPassword(fetchedPassword);
            } else {
                navigate("/");
            }
            setIsLoading(false);
        }
        checkStatus();
    }, []);

    useEffect(() => {
        function checkPasswordMatch() {
            if (newPassword === reenteredPassword && newPassword === "") {
                setPasswordMatchMessage("ℹ️ Please enter new passwords.");
            } else if (newPassword === reenteredPassword) {
                setPasswordMatchMessage("✓ Passwords matched.");
            } else {
                setPasswordMatchMessage("✗ Kindly check the new passwords.");
            }
        }
        checkPasswordMatch();
    }, [newPassword, reenteredPassword]);

    useEffect(() => {
        function validateOldPassword() {
            if (oldPassword === "") {
                setOldPasswordMessage("ℹ️ Please enter your old password.");
            } else if (oldPassword === password) {
                setOldPasswordMessage("✓ Password matched.");
            } else {
                setOldPasswordMessage("✗ Kindly check your old password.");
            }
        }
        validateOldPassword()
    }, [password, oldPassword])

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
        message: {
            fontSize: "1em",
            marginTop: "10px",
        },
        error: {
            color: "red",
        },
        success: {
            color: "green",
        },
        require: {
            color: "blue",
        },
    };

    async function handleUpdateButton() {
        try {
            if (oldPassword === "" || newPassword === "" || reenteredPassword === "") {
                setSnackbarMessage("Kindly fill all the password fields.")
                setSnackbarVisible(true)
            } else if (newPassword !== reenteredPassword || password !== oldPassword) {
                setSnackbarMessage("Kindly check the passwords.")
                setSnackbarVisible(true)
            } else if (newPassword === password) {
                setSnackbarMessage("New password cannot be the same as the current password.")
                setSnackbarVisible(true)
            } else {
                const response = await updatePassword(newPassword)
                if (response) {
                    setSnackbarMessage("Password updated successfully.")
                    setSnackbarVisible(true)
                    setPassword(newPassword)
                    setOldPassword("")
                    setNewPassword("");
                    setReenteredPassword("");
                }
            }
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
        <div style={styles.content}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <h1 style={styles.title}>Change Password</h1>
                <div>
                    <Button name="Back to Home" onClick={() => navigate("/dashboard")} />&nbsp;&nbsp;&nbsp;
                    <Button name="Logout" onClick={logout} />
                </div>
            </div>

            <TextField
                label="Enter Old Password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />

            {oldPasswordMessage && (
                <p style={oldPasswordMessage.includes("check") ? styles.error : oldPasswordMessage.includes("enter") ? styles.require : styles.success}>
                    {oldPasswordMessage}
                </p>
            )}

            <TextField
                label="Enter New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />

            <TextField
                label="Re-enter New Password"
                type="password"
                value={reenteredPassword}
                onChange={(e) => setReenteredPassword(e.target.value)}
            />

            {passwordMatchMessage && (
                <p style={passwordMatchMessage.includes("check") ?
                    styles.error : passwordMatchMessage.includes("enter") ?
                        styles.require : styles.success}>
                    {passwordMatchMessage}
                </p>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", gap: "10px" }}>
                <Button name="Change Password" onClick={handleUpdateButton} />
                <Button name="Forgot Password" onClick={() => { }} />
            </div>
            <Snackbar
                message={snackbarMessage}
                isVisible={snackbarVisible}
                onClose={() => setSnackbarVisible(false)}
            />
        </div>
    );
}

export default Settings;
