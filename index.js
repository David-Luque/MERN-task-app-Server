const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

//create server
const app = express();

//connect to dababase
connectDB();

//enable cors
app.use(cors());

//enable express.json
app.use(express.json({ extended: true }));

// app port
const PORT = process.env.PORT || 4000;

//import routes
app.use("/api/users", require('./routes/users'));
app.use("/api/auth", require('./routes/auth'));
app.use("/api/projects", require('./routes/projects'));
app.use("/api/tasks", require('./routes/tasks'));


// start the app
app.listen(PORT, ()=>{
    console.log(`Server listening in port ${PORT}`)
});