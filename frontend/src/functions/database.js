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
        const response = await axios.get("http://localhost:5000/majorCounts")
        if (response.status == 200) {
            return response.data.counts
        }
    } catch (error) {
        console.error("Error fetching major count: ", error)
    }
}

async function fetchUGDeptCount() {
    try {
        const response = await axios.get("http://localhost:5000/ugDeptCounts")
        if (response.status == 200) {
            return response.data.counts
        }
    } catch (error) {
        console.error("Error fetching UG department count: ", error)
    }
}

async function fetchPGDeptCount() {
    try {
        const response = await axios.get("http://localhost:5000/pgDeptCounts")
        if (response.status == 200) {
            return response.data.counts
        }
    } catch (error) {
        console.error("Error fetching PG department count: ", error)
    }
}

async function fetchLogs() {
    try {
        const response = await axios.get("http://localhost:5000/logs")
        if (response.status == 200) {
            return response.data.logs.slice(0, 5)
        }
    } catch (error) {
        console.error("Error fetching logs: ", error)
    }
}

async function fetchData() {
    try {
        const response = await axios.get("http://localhost:5000/students");
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
}

async function deleteData(id) {
    try {
        const response = await axios.delete(`http://localhost:5000/delete?id=${id}`);
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        console.error("Error deleting student:", error);
        throw new Error("Failed to delete student. Please try again.")
    }
}

async function filterData(queryString) {
    try {
        const response = await axios.get(`http://localhost:5000/filter?${queryString}`);

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
        const response = await axios.get(`http://localhost:5000/add-student?${queryString}`)
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

export {
    fetchUserName,
    fetchMajorCount,
    fetchUGDeptCount,
    fetchPGDeptCount,
    fetchLogs,
    fetchData,
    deleteData,
    filterData,
    addStudentData,
}
