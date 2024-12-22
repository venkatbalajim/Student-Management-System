import axios from "axios"

async function fetchUserName() {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:5000/verify", {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (response.status == 200) {
            return response.data.user.name
        }
    } catch (error) {
        console.error("Authentication check failed:", error);
    }
}

async function fetchMajorCount() {
    try {
        const response = await axios.get("http://localhost:5000/total-counts")
        if (response.status == 200) {
            return response.data.counts
        }
    } catch (error) {
        console.error("Error fetching major count: ", error)
    }
}

async function fetchUGDeptCount() {
    try {
        const response = await axios.get("http://localhost:5000/ug-dept-counts")
        if (response.status == 200) {
            return response.data.counts
        }
    } catch (error) {
        console.error("Error fetching UG department count: ", error)
    }
}

async function fetchPGDeptCount() {
    try {
        const response = await axios.get("http://localhost:5000/pg-dept-counts")
        if (response.status == 200) {
            return response.data.counts
        }
    } catch (error) {
        console.error("Error fetching PG department count: ", error)
    }
}

async function fetchStudentsLogs() {
    try {
        const response = await axios.get("http://localhost:5000/students-logs")
        if (response.status == 200) {
            return response.data.logs;
        }
    } catch (error) {
        console.error("Error fetching logs: ", error)
    }
}

async function fetchStudentsData() {
    try {
        const response = await axios.get("http://localhost:5000/students");
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
}

async function deleteStudentData(id) {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token is missing.");
        const response = await axios.delete(
            `http://localhost:5000/delete-student?id=${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        console.error("Error deleting student:", error);
        throw new Error("Failed to delete student. Please try again.")
    }
}

async function filterStudentsData(queryString) {
    try {
        const response = await axios.get(`http://localhost:5000/filter-students?${queryString}`);

        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        console.error(error);
        if (error.response) {
            throw new Error(error.response.data.error || "Failed  to apply filters.")
        } else if (error.request) {
            throw new Error("Server did not respond. Please check your network.")
        } else {
            throw new Error(`Error: ${error.response}`)
        }
    }
}

async function addStudentData(queryString) {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token is missing.");
        const response = await axios.get(
            `http://localhost:5000/add-student?${queryString}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        if (response.status === 200) {
            return true
        }
    } catch (error) {
        console.error(error);
        if (error.response) {
            throw new Error(error.response.data.error || "Failed  to apply filters.")
        } else if (error.request) {
            throw new Error("Server did not respond. Please check your network.")
        } else {
            throw new Error(`Error: ${error.response}`)
        }
    }
}

async function checkAdmin() {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token is missing.");

        const response = await axios.get(
            "http://localhost:5000/check-admin", { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return response.data.admin;
        }
    } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message);
        }
    }
}

async function fetchProfile() {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token is missing.");
        const response = await axios.get(
            "http://localhost:5000/profile", { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message);
        }
    }
}

async function fetchStaffsData() {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token is missing.");
        const response = await axios.get("http://localhost:5000/staffs");

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message);
        }
    }
}

async function deleteStaffData(queryString) {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token is missing.");
        const response = await axios.delete(
            `http://localhost:5000/delete-staff?${queryString}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error(error.message);
        }
    }
}

async function filterStaffsData(queryString) {
    try {
        const response = await axios.get(`http://localhost:5000/filter-staffs?${queryString}`);

        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        console.error(error);
        if (error.response) {
            throw new Error(error.response.data.error || "Failed  to apply filters.")
        } else if (error.request) {
            throw new Error("Server did not respond. Please check your network.")
        } else {
            throw new Error(`Error: ${error.response}`)
        }
    }
}

async function addStaffData(queryString) {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token is missing.");
        const response = await axios.get(
            `http://localhost:5000/add-staff?${queryString}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        if (response.status === 200) {
            return true
        }
    } catch (error) {
        console.error(error);
        if (error.response) {
            throw new Error(error.response.data.error)
        } else if (error.request) {
            throw new Error("Server did not respond. Please check your network.")
        } else {
            throw new Error(`Error: ${error.response}`)
        }
    }
}

async function clearStudentsLogs() {
    try {
        const response = await axios.delete("http://localhost:5000/clear-students-logs")
    } catch (error) {
        console.error(error);
        if (error.response) {
            throw new Error(error.response.data.error)
        } else if (error.request) {
            throw new Error("Server did not respond. Please check your network.")
        } else {
            throw new Error(`Error: ${error.response}`)
        }
    }
}

async function fetchStaffsLogs() {
    try {
        const response = await axios.get("http://localhost:5000/staffs-logs");
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        console.error(error);
        if (error.response) {
            throw new Error(error.response.data.error)
        } else if (error.request) {
            throw new Error("Server did not respond. Please check your network.")
        } else {
            throw new Error(`Error: ${error.response}`)
        }
    }
}

async function clearStaffsLogs() {
    try {
        const response = await axios.delete("http://localhost:5000/clear-staffs-logs")
    } catch (error) {
        console.error(error);
        if (error.response) {
            throw new Error(error.response.data.error)
        } else if (error.request) {
            throw new Error("Server did not respond. Please check your network.")
        } else {
            throw new Error(`Error: ${error.response}`)
        }
    }
}

export {
    fetchUserName,
    fetchMajorCount,
    fetchUGDeptCount,
    fetchPGDeptCount,
    fetchStudentsLogs,
    fetchStudentsData,
    deleteStudentData,
    filterStudentsData,
    addStudentData,
    checkAdmin,
    fetchProfile,
    fetchStaffsData,
    deleteStaffData,
    filterStaffsData,
    addStaffData,
    clearStudentsLogs,
    fetchStaffsLogs,
    clearStaffsLogs
}
