import axios from "axios"

async function checkConnection() {
    try {
        const res = await axios.get("http://localhost:5000");
        return res.data.request
    } catch (error) {
        console.error(error)
    }
}

function isValidPersonalEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const result = emailRegex.test(email);
    if (!result) {
        throw new Error("Invalid personal email.")
    }
    return result
}

function isValidCollegeEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const result = emailRegex.test(email) && email.toLowerCase().endsWith("@citchennai.net");
    if (!result) {
        throw new Error("Invalid college email.")
    }
    return result
}

function formatDate(dateString) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
};

function formatDateTwo(dateInput) {
    const date = new Date(dateInput);
    if (isNaN(date)) {
        throw new Error("Invalid date");
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function buildQueryString(filters) {
    let queryString = "";

    for (let key in filters) {
        if (filters[key] && typeof filters[key] === 'object' && 'condition' in filters[key] && 'value' in filters[key]) {
            const condition = filters[key].condition;
            const value = filters[key].value;

            if (condition !== "" && value !== "") {
                queryString += `${key}[condition]=${condition}&${key}[value]=${value}&`;
            }
        } else if (filters[key]) {
            queryString += `${key}=${encodeURIComponent(filters[key])}&`;
        }
    }

    if (queryString.endsWith('&')) {
        queryString = queryString.slice(0, -1);
    }

    return queryString;
};

function parseAndValidate(value, parseFn, fieldName) {
    if (value === "") return null;
    const parsedValue = parseFn(value);
    if (isNaN(parsedValue)) {
        throw new Error(`Invalid value for ${fieldName}. Please provide a valid number.`);
    }
    return parsedValue;
}

export {
    checkConnection,
    formatDate,
    formatDateTwo,
    buildQueryString,
    parseAndValidate,
    isValidPersonalEmail,
    isValidCollegeEmail,
}
