const mongoose = require('mongoose');
require('dotenv').config({ path: 'vars.env' });

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('Database connected')
    } catch(error) {
        console.log(error.response);
        //stop the app
        process.exit(1); 
    }
};

module.exports = connectDB;