const expres = require("express");
const app = expres();
const connectDB = require("./db");

require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

connectDB();

//import Routes
const userRoutes = require('./routes/userRoutes');

app.get("/", (req, res) => {
    res.send("Welcom to backend");
});

//use Routes
app.use('/user', userRoutes)

app.listen(PORT, () => {
    console.log('listening on port 3000');

})