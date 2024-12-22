import axios from "axios"
import * as xlsx from "xlsx"
import { saveAs } from "file-saver"

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

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    hours = hours.toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${period}`;
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

function generateExcel(data, fileName) {
    try {
        const sheet = xlsx.utils.json_to_sheet(data);
        const book = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(book, sheet, "Sheet1");
        const excelBuffer = xlsx.write(book, { bookType: "xlsx", type: "array" });
        const file = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(file, `${fileName}.xlsx`);
    } catch (error) {
        console.error("Error generating Excel file:", error);
        throw new Error("Unable to download as Excel.");
    }
}

export {
    checkConnection,
    formatDate,
    formatDateTwo,
    formatDateTime,
    buildQueryString,
    parseAndValidate,
    isValidPersonalEmail,
    isValidCollegeEmail,
    generateExcel,
}
