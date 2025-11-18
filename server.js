const express = require("express");
const app = express();
const connectDB = require("./db");

require("dotenv").config();

app.use(express.json());


const PORT = process.env.PORT || 3000;

connectDB();

//import Routes
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
app.get("/", (req, res) => {
    res.send("Welcom to backend");
});

//use Routes
app.use('/user', userRoutes)
app.use('/candidate', candidateRoutes)

app.listen(PORT, () => {
    console.log('listening on port 3000');

})