const mongoose = require("mongoose");

async function connectDb(url) {
    console.log("Received URL:", url); // Print out the received 
    try {
        await mongoose.connect(url);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Re-throw the error for the caller to handle
    }
}

module.exports = {
    connectDb
}