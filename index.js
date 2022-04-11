//const express = require('express');
import express from 'express';
//const connectDB = require('./config/db');
import connectDB from './config/db.js'
import dotenv from 'dotenv';
//const cors = require('cors');
import cors from 'cors';

import userRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';


//create server
const app = express();

//connect to dababase
connectDB();

//enable cors
app.options('*', cors());
app.use(cors({
    origin: [process.env.FRONTEND_POINT, "http://localhost:3000"]
}));

//enable express.json
app.use(express.json({ extended: true }));

//import routes
//app.use("/api/users", require('./routes/users'));
app.use("/api/users", userRoutes);
//app.use("/api/auth", require('./routes/auth'));
app.use("/api/auth", authRoutes);
//app.use("/api/projects", require('./routes/projects'));
app.use("/api/projects", projectRoutes);
//app.use("/api/tasks", require('./routes/tasks'));
app.use('/api/tasks', taskRoutes)

// app port
const PORT = process.env.PORT || 4000;

// start the app
app.listen(PORT, '0.0.0.0', ()=>{
    console.log(`Server listening in PORT ${PORT}`)
});