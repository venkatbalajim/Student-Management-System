import axios from "axios"
import { useNavigate } from "react-router-dom"
import { buildQueryString } from "./helpers"

async function login(email, pwd) {
    try {
        const response = await axios.post("http://localhost:5000/login/", {
            email: email,
            password: pwd,
        })
        localStorage.setItem("authToken", response.data.token)
        return true
    } catch (error) {
        if (error.response && error.response.data.error) {
            throw new Error(error.response.data.error)
        } else {
            throw new Error("An unexpected error occurred.")
        }
    }
}

function useLogout() {
    const navigate = useNavigate();
    function logout() {
        try {
            localStorage.removeItem("authToken");
            navigate("/");
        } catch (error) {
            console.error(error);
            throw new Error("Failed to logout");
        }
    }
    return logout;
}

async function checkAuthentication() {
    try {
        const token = localStorage.getItem("authToken");
        if (token) {
            const res = await axios.get("http://localhost:5000/verify", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 200) {
                return true;
            }
        }
    } catch (error) {
        console.error("Authentication check failed:", error);
    }
}

async function fetchPassword() {
    try {
        const token = localStorage.getItem("authToken");
        if (token) {
            const response = await axios.get("http://localhost:5000/fetch-password", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                return response.data.password;
            }
        } else {
            throw new Error("Authentication token is missing.");
        }
    } catch (error) {
        console.error(error);
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message);
        }
    }
}

async function updatePassword(newPassword) {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token is missing.");

        const response = await axios.post(
            "http://localhost:5000/update-password",
            { newPassword },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return true;
        } else {
            throw new Error("Failed to update password.");
        }
    } catch (error) {
        console.error(error);
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message);
        }
    }
}

export { login, useLogout, checkAuthentication, fetchPassword, updatePassword, }
