import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/button";
import Dropdown from "../components/dropdown";
import TextField from "../components/text_field";
import Snackbar from "../components/snack_bar";
import { buildQueryString, isValidCollegeEmail } from "../functions/helpers";
import { checkAuthentication } from "../functions/authentication"
import { addStaffData } from "../functions/database";

function StaffsForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const details = location.state;

    const [isLoading, setIsLoading] = useState(true);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const [data, setData] = useState({
        name: "",
        email: "",
        position: "",
        admin: "",
        id: -1,
    })

    useEffect(() => {
        async function initializeData() {
            try {
                const authStatus = await checkAuthentication();
                if (!authStatus) {
                    navigate("/")
                }
                if (details && details.name) {
                    const initialData = {
                        name: details?.name || "",
                        email: details?.email || "",
                        position: details?.position || "",
                        admin: details?.admin === 0 ? "No" : details?.admin === 1 ? "Yes" : "",
                        id: details?.id || -1,
                    }
                    setData(initialData);
                    setSnackbarMessage("All the details are autofilled.");
                    setSnackbarVisible(true);
                } else {
                    setSnackbarMessage("A new staff form initialized.");
                    setSnackbarVisible(true);
                }
            } catch (error) {
                setSnackbarMessage("A new staff form initialized.");
                setSnackbarVisible(true);
            } finally {
                setIsLoading(false);
            }
        }
        initializeData()
    }, [details])

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
        container: {
            display: "flex",
            flexWrap: "no-wrap",
            gap: "20px",
            justifyContent: "flex-start",
            marginBottom: "20px",
        },
        item: {
            flex: "1 1 calc(30% - 20px)",
        },
        formContainer: {
            width: "100%",
            boxSizing: "border-box",
            border: "3px solid #E2E8F0",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
        },
    };

    function handleChange(value, field) {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function handleSubmit() {
        try {
            if (data.name === "" || data.email === "" || data.position === "" || data.admin === "") {
                setSnackbarMessage("Kindly fill all the details.")
                setSnackbarVisible(true)
                return
            }
            isValidCollegeEmail(data.email)
            setIsLoading(true)
            const queryString = buildQueryString(data);
            const response = await addStaffData(queryString);
            if (response) {
                setSnackbarMessage("Details uploaded successfully and email sent to the staff.");
                setSnackbarVisible(true);
                setTimeout(() => {
                    navigate("/staffs")
                }, 2000);
            }
        } catch (error) {
            console.error(error.message);
            setSnackbarMessage(error.message);
            setSnackbarVisible(true);
        } finally {
            setIsLoading(false)
        }
    }

    function handleClear() {
        window.location.reload();
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
                <h1 style={styles.title}>Staffs Form</h1>
                <div style={styles.formContainer}>
                    <div style={styles.container}>
                        <TextField
                            label="Name"
                            type="text"
                            value={data.name}
                            onChange={(e) => handleChange(e.target.value, "name")}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={data.email}
                            onChange={(e) => handleChange(e.target.value, "email")}
                        />
                        <TextField
                            label="Position"
                            type="text"
                            value={data.position}
                            onChange={(e) => handleChange(e.target.value, "position")}
                        />
                        <Dropdown
                            label="Admin"
                            options={["", "No", "Yes"]}
                            value={data.admin}
                            onChange={(e) => handleChange(e.target.value, "admin")}
                        />
                    </div>
                    <br />
                    <div>
                        <p>ℹ️ In case you are adding new staff account data, then the default account password is <i><b>password</b></i>. ℹ️</p>
                        <br />
                    </div>
                    <div style={styles.container}>
                        <Button name="Submit" onClick={handleSubmit} />
                        <Button name="Clear" onClick={handleClear} />
                    </div>
                </div>
            </div>
            {snackbarVisible && (
                <Snackbar message={snackbarMessage} isVisible={snackbarVisible} onClose={() => { setSnackbarVisible(false) }} />
            )}
        </div>
    );
}

export default StaffsForm;
