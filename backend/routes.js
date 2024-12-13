const express = require("express")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const router = express.Router()
const database = require("./database")
const verifyToken = require("./middleware")

dotenv.config()
const secretKey = process.env.JWT_KEY

router.get("/", (req, res) => {
    res.send({ request: true });
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Both email and password are required." });
        }
        const [rows] = await database.query("SELECT * FROM accounts WHERE email = ? AND password = ?", [email, password]);
        if (rows.length > 0) {
            const user = rows[0];
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    position: user.position,
                    admin: user.admin,
                },
                secretKey,
                { expiresIn: "1h" }
            );
            return res.status(200).json({
                message: "Successful",
                token: token,
                account: {
                    id: user.id,
                    email: user.email,
                },
            });
        } else {
            return res.status(404).json({ error: "Invalid email or password." });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." });
    }
});

router.get("/verify", verifyToken, (req, res) => {
    res.status(200).send({ message: "You have already logged in.", user: req.user });
});

router.get("/majorCounts", async (req, res) => {
    try {
        const total = await database.query("SELECT * FROM students");
        const beCount = await database.query("SELECT * FROM students WHERE degree = ?", ["B.E"]);
        const btechCount = await database.query("SELECT * FROM students WHERE degree = ?", ["B.Tech"]);
        const meCount = await database.query("SELECT * FROM students WHERE degree = ?", ["M.E"]);
        const mtechCount = await database.query("SELECT * FROM students WHERE degree = ?", ["M.Tech"])
        const majorLengths = [
            total[0].length,
            beCount[0].length + btechCount[0].length,
            meCount[0].length + mtechCount[0].length
        ];
        return res.status(200).json({ message: true, counts: majorLengths });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
})

router.get("/ugDeptCounts", async (req, res) => {
    try {
        const bme = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["B.E", "BME"]);
        const csbs = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["B.E", "CSBS"]);
        const cse = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["B.E", "CSE"]);
        const cseAids = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["B.E", "CSE - AIDS"]);
        const cseAiml = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["B.E", "CSE - AIML"]);
        const cseCz = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["B.E", "CSE - CZ"]);
        const cvl = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["B.E", "CVL"]);
        const ece = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["B.E", "ECE"]);
        const eceAct = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["B.E", "ECE - ACT"]);
        const eceVlsi = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["B.E", "ECE - VLSI"]);
        const it = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["B.Tech", "IT"]);
        const mech = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["B.E", "MECH"]);
        const mct = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["B.E", "MCT"]);
        const eee = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["B.E", "EEE"]);

        const departmentLengths = [
            bme[0].length,
            csbs[0].length,
            cse[0].length,
            cseAids[0].length,
            cseAiml[0].length,
            cseCz[0].length,
            cvl[0].length,
            ece[0].length,
            eceAct[0].length,
            eceVlsi[0].length,
            eee[0].length,
            it[0].length,
            mech[0].length,
            mct[0].length
        ];
        return res.status(200).json({ success: true, counts: departmentLengths });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
})

router.get("/pgDeptCounts", async (req, res) => {
    try {
        const ae = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["M.E", "AE"])
        const act = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["M.E", "ACT"])
        const cad = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["M.E", "CAD"])
        const cse = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["M.E", "CSE"])
        const vlsi = await database.query("SELECT * FROM students WHERE degree = ? AND department = ?", ["M.E", "VLSI"])
        const departmentLengths = [
            ae[0].length,
            act[0].length,
            cad[0].length,
            cse[0].length,
            vlsi[0].length
        ]
        return res.status(200).json({ success: true, counts: departmentLengths });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
})

router.get("/logs", async (req, res) => {
    try {
        const logs = await database.query("SELECT * FROM students_logs");
        return res.status(200).json({ success: true, logs: logs[0] });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error." });
    }
})

router.get("/students", async (req, res) => {
    try {
        const students = await database.query("SELECT * FROM students");
        return res.status(200).json(students[0]);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error." });
    }
})

router.delete("/delete", async (req, res) => {
    try {
        const id = req.query.id;
        const student = await database.query("DELETE FROM students WHERE id = ?", [id]);
        return res.status(200).json({ success: true, message: "Student deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

router.get("/filter", async (req, res) => {
    try {
        let query = "SELECT * FROM students WHERE 1 = 1 ";
        let values = [];

        for (let key in req.query) {
            if (key == 'name') {
                query += "AND name LIKE ? ";
                values.push(`%${req.query.name}%`);
            } else if (key == 'gender') {
                query += "AND gender = ? ";
                values.push(req.query.gender);
            } else if (key == 'hosteller') {
                query += "AND hosteller = ? ";
                values.push(req.query.hosteller);
            } else if (key == 'email') {
                query += "AND (college_email LIKE ? OR personal_email LIKE ?) ";
                values.push(`%${req.query.email}%`);
                values.push(`%${req.query.email}%`);
            } else if (key == 'phoneNo') {
                query += "AND (student_mobile LIKE ? OR parent_mobile LIKE ?) ";
                values.push(`%${req.query.phoneNo}%`);
                values.push(`%${req.query.phoneNo}%`);
            } else if (key == 'address') {
                query += "AND address LIKE ? ";
                values.push(`%${req.query.address}%`);
            } else if (key == 'register_number') {
                query += "AND register_number LIKE ? ";
                values.push(`%${req.query.register_number}%`);
            } else if (key == 'degree') {
                query += "AND degree = ? ";
                values.push(req.query.degree);
            } else if (key == 'year') {
                query += "AND year = ? ";
                values.push(req.query.year);
            } else if (key == 'department') {
                query += "AND department = ? ";
                values.push(req.query.department);
            } else if (key == 'section') {
                query += "AND section = ? ";
                values.push(req.query.section);
            } else if (key == 'cgpa') {
                let operator = "";
                if (req.query.cgpa.condition === "Above") {
                    operator = ">";
                } else if (req.query.cgpa.condition === "Below") {
                    operator = "<";
                } else if (req.query.cgpa.condition === "Equal") {
                    operator = "=";
                }
                if (operator && req.query.cgpa.value) {
                    query += `AND cgpa ${operator} ? `;
                    values.push(parseFloat(req.query.cgpa.value));
                }
            } else if (key == 'tenth_percent') {
                let operator = "";
                if (req.query.tenth_percent.condition === "Above") {
                    operator = ">";
                } else if (req.query.tenth_percent.condition === "Below") {
                    operator = "<";
                } else if (req.query.tenth_percent.condition === "Equal") {
                    operator = "=";
                }
                if (operator && req.query.tenth_percent.value) {
                    query += `AND tenth_percent ${operator} ? `;
                    values.push(parseFloat(req.query.tenth_percent.value));
                }
            } else if (key == 'twelfth_percent') {
                let operator = "";
                if (req.query.twelfth_percent.condition === "Above") {
                    operator = ">";
                } else if (req.query.twelfth_percent.condition === "Below") {
                    operator = "<";
                } else if (req.query.twelfth_percent.condition === "Equal") {
                    operator = "=";
                }
                if (operator && req.query.twelfth_percent.value) {
                    query += `AND twelfth_percent ${operator} ? `;
                    values.push(parseFloat(req.query.twelfth_percent.value));
                }
            } else if (key == 'standing_arrear') {
                let operator = "";
                if (req.query.standing_arrear.condition === "Above") {
                    operator = ">";
                } else if (req.query.standing_arrear.condition === "Below") {
                    operator = "<";
                } else if (req.query.standing_arrear.condition === "Equal") {
                    operator = "=";
                }
                if (operator && req.query.standing_arrear.value) {
                    query += `AND standing_arrear ${operator} ? `;
                    values.push(parseInt(req.query.standing_arrear.value));
                }
            } else if (key == 'history_arrear') {
                let operator = "";
                if (req.query.history_arrear.condition === "Above") {
                    operator = ">";
                } else if (req.query.history_arrear.condition === "Below") {
                    operator = "<";
                } else if (req.query.history_arrear.condition === "Equal") {
                    operator = "=";
                }
                if (operator && req.query.history_arrear.value) {
                    query += `AND history_arrear ${operator} ? `;
                    values.push(parseInt(req.query.history_arrear.value));
                }
            } else if (key == 'fees') {
                let operator = "";
                if (req.query.fees.condition === "Above") {
                    operator = ">";
                } else if (req.query.fees.condition === "Below") {
                    operator = "<";
                } else if (req.query.fees.condition === "Equal") {
                    operator = "=";
                }
                if (operator && req.query.fees.value) {
                    query += `AND fees ${operator} ? `;
                    values.push(parseFloat(req.query.fees.value));
                }
            } else if (key == 'fees_due') {
                if (req.query.fees_due === "Yes") {
                    query += "AND fees_due <> 0 ";
                } else if (req.query.fees_due === "No") {
                    query += "AND fees_due = 0 ";
                }
            }
        }
        query = query.trim();
        if (query === "SELECT * FROM students WHERE 1 = 1") {
            return res.status(400).json({ error: "No valid filters applied." });
        }

        const response = await database.query(query, values);
        return res.status(200).json(response[0]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

router.get("/add-student", async (req, res) => {
    try {
        const query = "INSERT INTO students (name, gender, date_of_birth, personal_email, student_mobile, parent_mobile, address, register_number, college_email, degree, year, department, section, hosteller, cgpa, standing_arrear, history_arrear, tenth_percent, twelfth_percent, diploma, fees, fees_due) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), gender = VALUES(gender), date_of_birth = VALUES(date_of_birth), student_mobile = VALUES(student_mobile), parent_mobile = VALUES(parent_mobile), address = VALUES(address), register_number = VALUES(register_number), college_email = VALUES(college_email), degree = VALUES(degree), year = VALUES(year), department = VALUES(department), section = VALUES(section), hosteller = VALUES(hosteller), cgpa = VALUES(cgpa), standing_arrear = VALUES(standing_arrear), history_arrear = VALUES(history_arrear), tenth_percent = VALUES(tenth_percent), twelfth_percent = VALUES(twelfth_percent), diploma = VALUES(diploma), fees = VALUES(fees), fees_due = VALUES(fees_due);";

        const hosteller = req.query.hosteller ? parseInt(req.query.hosteller) : 0;
        const cgpa = req.query.cgpa ? parseFloat(req.query.cgpa) : null;
        const standingArrear = req.query.standing_arrear ? parseInt(req.query.standing_arrear) : 0;
        const historyArrear = req.query.history_arrear ? parseInt(req.query.history_arrear) : 0;
        const tenthPercent = req.query.tenth_percent ? parseFloat(req.query.tenth_percent) : null;
        const twelfthPercent = req.query.twelfth_percent ? parseFloat(req.query.twelfth_percent) : null;
        const fees = req.query.fees ? parseFloat(req.query.fees) : null;
        const feesDueArray = req.query.fees_due
            ? req.query.fees_due.split(",").map(fee => parseFloat(fee.trim()) || 0)
            : [];

        const values = [
            req.query.name,
            req.query.gender,
            req.query.date_of_birth,
            req.query.personal_email,
            req.query.student_mobile,
            req.query.parent_mobile,
            req.query.address,
            req.query.register_number,
            req.query.college_email,
            req.query.degree,
            parseInt(req.query.year),
            req.query.department,
            req.query.section,
            hosteller,
            cgpa,
            standingArrear,
            historyArrear,
            tenthPercent,
            twelfthPercent,
            req.query.diploma || null,
            fees,
            JSON.stringify(feesDueArray)
        ];

        const response = await database.query(query, values);
        return res.status(200).json({ message: "Data added successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

router.get("/fetch-password", verifyToken, async (req, res) => {
    try {
        const ID = req.user.id;
        const response = await database.query("SELECT password FROM accounts WHERE id = ?", [ID]);
        if (response.length > 0) {
            return res.status(200).json({ password: response[0][0].password });
        } else {
            return res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/update-password", verifyToken, async (req, res) => {
    try {
        const ID = req.user.id;
        const { newPassword } = req.body;

        if (!newPassword || typeof newPassword !== "string") {
            return res.status(400).json({ error: "Invalid new password." });
        }

        const response = await database.query("UPDATE accounts SET password = ? WHERE id = ?", [newPassword, ID]);
        return res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
