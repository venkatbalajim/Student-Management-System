import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/button";
import Dropdown from "../components/dropdown";
import TextField from "../components/text_field";
import Snackbar from "../components/snack_bar";
import DatePicker from "../components/date_picker"
import { buildQueryString, isValidCollegeEmail, isValidPersonalEmail, parseAndValidate, formatDateTwo } from "../functions/helpers";
import { checkAuthentication } from "../functions/authentication"
import { addStudentData } from "../functions/database";

function StudentForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const details = location.state;

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const genderOptions = ['', 'Male', 'Female', 'Other'];
    const degreeOptions = ['', 'B.E', 'B.Tech', 'M.E', 'M.Tech'];
    const yearOptions = ['', 1, 2, 3, 4];
    const departmentOptions = ['', 'BME', 'CSBS', 'CSE', 'CSE - AIDS', 'CSE - AIML', 'CSE - CZ', 'CVL', 'ECE', 'ECE - ACT', 'ECE - VLSI', 'EEE', 'IT', 'MECH', 'MCT', 'AE', 'ACT', 'CAD', 'VLSI'];
    const sectionOptions = ['', 'A', 'B', 'C', 'D'];
    const typeOptions = ['', 'Dayscholar', 'Hosteller'];

    const [data, setData] = useState({
        name: details.name || "",
        gender: details.gender || "",
        hosteller: "",
        personal_email: "",
        college_email: "",
        date_of_birth: "",
        student_mobile: "",
        parent_mobile: "",
        address: "",
        register_number: "",
        degree: "",
        year: "",
        department: "",
        section: "",
        cgpa: "",
        tenth_percent: "",
        twelfth_percent: "",
        standing_arrear: 0,
        history_arrear: 0,
        fees: "",
        fees_due: Array(8).fill(0),
        diploma: "",
    });

    useEffect(() => {
        async function initializeData() {
            try {
                const isAuthenticated = await checkAuthentication();
                setIsAuthenticated(isAuthenticated);

                const initialData = {
                    name: details?.name || "",
                    gender: details?.gender || "",
                    hosteller: details?.hosteller === 1 ? "Hosteller" : (details?.hosteller === 0 ? "Dayscholar" : ""),
                    personal_email: details?.personal_email || "",
                    college_email: details?.college_email || "",
                    date_of_birth: formatDateTwo(details?.date_of_birth) || "",
                    student_mobile: details?.student_mobile || "",
                    parent_mobile: details?.parent_mobile || "",
                    address: details?.address || "",
                    register_number: details?.register_number || "",
                    degree: details?.degree || "",
                    year: details?.year || "",
                    department: details?.department || "",
                    section: details?.section || "",
                    cgpa: details?.cgpa || "",
                    tenth_percent: details?.tenth_percent || "",
                    twelfth_percent: details?.twelfth_percent || "",
                    standing_arrear: details?.standing_arrear || 0,
                    history_arrear: details?.history_arrear || 0,
                    fees: details?.fees || "",
                    fees_due: details?.fees_due || Array(8).fill(0),
                    diploma: details?.diploma || "",
                };

                setData(initialData);
                setSnackbarMessage("All the details are autofilled.");
                setSnackbarVisible(true);
            } catch (error) {
                setSnackbarMessage("A new student form initialized.");
                setSnackbarVisible(true);
            } finally {
                setIsLoading(false);
            }
        }

        initializeData();
    }, [details]);

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

    function handleFeesDueChange(value, semesterIndex) {
        setData((prev) => {
            const updatedFeesDue = [...prev.fees_due];
            updatedFeesDue[semesterIndex] = value;
            return {
                ...prev,
                fees_due: updatedFeesDue,
            };
        });
    }

    async function handleSubmit() {
        try {
            const finalData = { ...data };

            try {
                finalData.hosteller = (finalData.hosteller == "Hosteller" ? 1 : 0)

                finalData.year = parseAndValidate(data.year, parseInt, "Year");
                finalData.standing_arrear = parseAndValidate(data.standing_arrear, parseInt, "Standing Arrear");
                finalData.history_arrear = parseAndValidate(data.history_arrear, parseInt, "History of Arrear");

                finalData.cgpa = parseAndValidate(data.cgpa, parseFloat, "CGPA");
                finalData.tenth_percent = parseAndValidate(data.tenth_percent, parseFloat, "10th Percent");
                finalData.twelfth_percent = parseAndValidate(data.twelfth_percent, parseFloat, "12th Percent");
                finalData.fees = parseAndValidate(data.fees, parseFloat, "Annual Fees");

                finalData.fees_due = data.fees_due.map((fee, index) =>
                    parseAndValidate(fee, parseFloat, `Fees Due - Semester ${index + 1}`)
                );
            } catch (error) {
                setSnackbarMessage(error.message);
                setSnackbarVisible(true);
                return;
            }

            finalData.fees_due =
                finalData.degree === "M.E" || finalData.degree === "M.Tech"
                    ? finalData.fees_due.slice(0, 6)
                    : finalData.fees_due;

            for (let key in finalData) {
                if (key === "personal_email") {
                    finalData[key] = finalData[key].toLowerCase();
                    isValidPersonalEmail(finalData[key])
                } else if (key === "college_email") {
                    finalData[key] = finalData[key].toLowerCase();
                    isValidCollegeEmail(finalData[key])
                } else if ((key === "tenth_percent" || key === "twelfth_percent") && (finalData[key] < 0 || finalData[key] > 100)) {
                    setSnackbarMessage("Percent values should be between 0 and 100.");
                    setSnackbarVisible(true);
                    return;
                } else if (key === "cgpa" && (finalData[key] < 0 || finalData[key] > 10)) {
                    setSnackbarMessage("CGPA should be between 0 and 10.");
                    setSnackbarVisible(true);
                    return;
                } else if (key === "fees" && (finalData[key] < 0)) {
                    setSnackbarMessage("Annual Fees should be greater than 0.");
                    setSnackbarVisible(true);
                    return;
                } else if (key === "fees_due") {
                    for (let i = 0; i < finalData[key].length; i++) {
                        if (finalData[key][i] < 0) {
                            setSnackbarMessage("Fees Due should be greater than 0.");
                            setSnackbarVisible(true);
                            return;
                        }
                    }
                }
                else if ((finalData[key] === "" || finalData[key] === null) && key != "diploma") {
                    setSnackbarMessage("Kindly fill all the details.");
                    setSnackbarVisible(true);
                    return;
                }
            }

            const queryString = buildQueryString(finalData);
            const response = await addStudentData(queryString)
            if (response) {
                setSnackbarMessage("Details uploaded successfully");
                setSnackbarVisible(true);
                setTimeout(() => {
                    navigate("/students")
                }, 2000);
            }
        } catch (error) {
            console.error(error.message);
            setSnackbarMessage(error.message);
            setSnackbarVisible(true);
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

    if (!isAuthenticated) {
        navigate("/");
    }

    return (
        <div>
            <div style={styles.content}>
                <h1 style={styles.title}>Students Form</h1>
                <div style={styles.formContainer}>
                    <div style={styles.container}>
                        <TextField
                            label="Name"
                            type="text"
                            value={data.name}
                            onChange={(e) => handleChange(e.target.value, "name")}
                        />
                        <Dropdown
                            label="Gender"
                            options={genderOptions}
                            value={data.gender}
                            onChange={(e) => handleChange(e.target.value, "gender")}
                        />
                        <Dropdown
                            label="Category"
                            options={typeOptions}
                            value={data.hosteller}
                            onChange={(e) => handleChange(e.target.value, "hosteller")}
                        />
                        <DatePicker
                            label="Date of Birth"
                            value={data.date_of_birth}
                            onChange={(e) => handleChange(e.target.value, "date_of_birth")}
                        />
                        <TextField
                            label="Personal Email"
                            type="email"
                            value={data.personal_email}
                            onChange={(e) => handleChange(e.target.value, "personal_email")}
                        />
                    </div>
                    <div style={styles.container}>
                        <TextField
                            label="College Email"
                            type="email"
                            value={data.college_email}
                            onChange={(e) => handleChange(e.target.value, "college_email")}
                        />
                        <TextField
                            label="Student Mobile"
                            type="tel"
                            value={data.student_mobile}
                            onChange={(e) => handleChange(e.target.value, "student_mobile")}
                        />
                        <TextField
                            label="Parent Mobile"
                            type="tel"
                            value={data.parent_mobile}
                            onChange={(e) => handleChange(e.target.value, "parent_mobile")}
                        />
                        <TextField
                            label="Location"
                            type="text"
                            value={data.address}
                            onChange={(e) => handleChange(e.target.value, "address")}
                        />
                        <TextField
                            label="Register No"
                            type="text"
                            value={data.register_number}
                            onChange={(e) => handleChange(e.target.value, "register_number")}
                        />
                    </div>
                    <div style={styles.container}>
                        <Dropdown
                            label="Degree"
                            options={degreeOptions}
                            value={data.degree}
                            onChange={(e) => handleChange(e.target.value, "degree")}
                        />
                        <Dropdown
                            label="Year"
                            options={yearOptions}
                            value={data.year}
                            onChange={(e) => handleChange(e.target.value, "year")}
                        />
                        <Dropdown
                            label="Department"
                            options={departmentOptions}
                            value={data.department}
                            onChange={(e) => handleChange(e.target.value, "department")}
                        />
                        <Dropdown
                            label="Section"
                            options={sectionOptions}
                            value={data.section}
                            onChange={(e) => handleChange(e.target.value, "section")}
                        />
                        <TextField
                            label="Diploma"
                            type="text"
                            value={data.diploma}
                            onChange={(e) => handleChange(e.target.value, "diploma")}
                        />
                    </div>
                    <div style={styles.container}>
                        <TextField
                            label="CGPA"
                            type="number"
                            value={data.cgpa}
                            onChange={(e) => handleChange(e.target.value, "cgpa")}
                        />
                        <TextField
                            label="10th Percent"
                            type="number"
                            value={data.tenth_percent}
                            onChange={(e) => handleChange(e.target.value, "tenth_percent")}
                        />
                        <TextField
                            label="12th Percent"
                            type="number"
                            value={data.twelfth_percent}
                            onChange={(e) => handleChange(e.target.value, "twelfth_percent")}
                        />
                        <TextField
                            label="Standing Arrear"
                            type="number"
                            value={data.standing_arrear}
                            onChange={(e) => handleChange(e.target.value, "standing_arrear")}
                        />
                        <TextField
                            label="History of Arrear"
                            type="number"
                            value={data.history_arrear}
                            onChange={(e) => handleChange(e.target.value, "history_arrear")}
                        />
                        <TextField
                            label="Annual Fees"
                            type="number"
                            value={data.fees}
                            onChange={(e) => handleChange(e.target.value, "fees")}
                        />
                    </div>

                    {(data.degree === 'B.E' || data.degree === 'B.Tech') && (
                        <div style={styles.container}>
                            {[...Array(8).keys()].map((i) => (
                                <TextField
                                    key={i}
                                    label={`Fees Due - Semester ${i + 1}`}
                                    type="text"
                                    value={data.fees_due[i]}
                                    onChange={(e) => handleFeesDueChange(e.target.value, i)}
                                />
                            ))}
                        </div>
                    )}

                    {(data.degree === 'M.E' || data.degree === 'M.Tech') && (
                        <div style={styles.container}>
                            {[...Array(6).keys()].map((i) => (
                                <TextField
                                    key={i}
                                    label={`Fees Due - Semester ${i + 1}`}
                                    type="text"
                                    value={data.fees_due[i]}
                                    onChange={(e) => handleFeesDueChange(e.target.value, i)}
                                />
                            ))}
                        </div>
                    )}

                    <br />
                    <div>
                        <p>ℹ️ In case you leave <i><b>Standing Arrear</b></i>, <i><b>History of Arrear</b></i> or <i><b>Fees Dues</b></i> details empty, then default value is <i><b>ZERO</b></i>. ℹ️</p>
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

export default StudentForm;
