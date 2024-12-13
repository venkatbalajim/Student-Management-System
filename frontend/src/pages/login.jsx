import Button from "../components/button"
import Snackbar from "../components/snack_bar"
import TextField from "../components/text_field"
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { checkConnection } from "../functions/helpers"
import { login, checkAuthentication } from "../functions/authentication"

function Login() {
    const navigate = useNavigate()

    const styles = {
        page: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            margin: "5%",
        },
        title: {
            fontSize: "2em",
            color: "#2A4365",
        },
        container: {
            textAlign: "center",
            width: "50%",
            background: "#F7FAFC",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        },
        subtitle: {
            fontSize: "1.5em",
            color: "#2873c9",
        },
        form: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
    }

    const [request, setRequest] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const [isSnackbarVisible, setIsSnackbarVisible] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    useEffect(() => {
        async function checkStatus() {
            const connection = await checkConnection()
            setRequest(connection)

            const authStatus = await checkAuthentication()
            setIsAuthenticated(authStatus)

            setIsLoading(false)
        }

        checkStatus()
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard")
        }
    }, [isAuthenticated, navigate])

    function handleEmail(value) {
        setEmail(value)
    }

    function handlePassword(value) {
        setPwd(value)
    }

    async function handleSubmit() {
        try {
            const success = await login(email, pwd)
            if (success) {
                setIsAuthenticated(true)
            }
        } catch (error) {
            setSnackbarMessage(error.message)
            setIsSnackbarVisible(true)
        }
    }

    if (isLoading) {
        return (
            <div>
                <p>Loading ...</p>
            </div>
        )
    }

    if (!request) {
        return (
            <div style={styles.page}>
                <h1 style={styles.title}>Sorry, an internal error occurred.</h1>
            </div>
        )
    }

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>Students Management System</h1>
            <div style={styles.container}>
                <h2 style={styles.subtitle}>Login using your account</h2>
                <br />
                <form
                    style={styles.form}
                    onSubmit={(event) => {
                        event.preventDefault()
                    }}
                >
                    <TextField
                        label="Email ID"
                        type="email"
                        onChange={(event) => handleEmail(event.target.value)}
                    />
                    <br />
                    <TextField
                        label="Password"
                        type="password"
                        onChange={(event) => handlePassword(event.target.value)}
                    />
                    <br />
                    <Button name="Submit" onClick={handleSubmit}></Button>
                </form>
            </div>
            <Snackbar
                message={snackbarMessage}
                isVisible={isSnackbarVisible}
                onClose={() => setIsSnackbarVisible(false)}
            />
        </div>
    )
}

export default Login
