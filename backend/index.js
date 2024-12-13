const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes.js");
const cors = require("cors")

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
