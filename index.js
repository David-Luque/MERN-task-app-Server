const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

//create server
const app = express();

//connect to dababase
connectDB();

//enable cors
app.options('*', cors());
app.use(cors({
    origin: process.env.FRONTEND_POINT
}));

//enable express.json
app.use(express.json({ extended: true }));

//import routes
app.use("/api/users", require('./routes/users'));
app.use("/api/auth", require('./routes/auth'));
app.use("/api/projects", require('./routes/projects'));
app.use("/api/tasks", require('./routes/tasks'));

// app port
const port = process.env.PORT || 4000;

// start the app
app.listen(port, '0.0.0.0', ()=>{
    console.log(`Server listening in port ${port}`)
});