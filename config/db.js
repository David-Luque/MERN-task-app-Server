//const mongoose = require('mongoose');
import mongoose from 'mongoose';
//require('dotenv').config({ path: 'vars.env' });
import dotenv from 'dotenv';
dotenv.config({ path: 'vars.env' });

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('Database connected')
    } catch(error) {
        console.log("Error while connecting to DB: ", error.response);
        //stop the app
        process.exit(1); 
    }
};

export default connectDB;