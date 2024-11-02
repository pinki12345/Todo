const express = require('express')
const app = express();
const fs = require("fs");
const user = require("./routes/user");
const task = require("./routes/task");
const board = require("./routes/board");
const dbConnection = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT;

app.use(cors({
    origin: ['http://localhost:5173'],
    exposedHeaders: ['Authorization'],
    credentials: true,
  }));

dbConnection();

app.use(express.json());


app.use('/api/v1',user);
app.use('/api/v1',task);
app.use('/api/v1',board);


app.get("/", (req, res) => {
    res.send("Welcome to the Todo API!");
})

app.use((err, req, res, next) => {
    let log;
    log = err.stack;
    log += `/n${req.method} - ${req.url} - ${req.ip} - ${new Date()}/n`;
    fs.appendFile("error.txt", log, (err) => {
        if (err) {
            console.log(err);
        }
    });
    res.status(500).send("Something went wrong");
});
  

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})