const mongoose = require('mongoose');

const uri = "mongodb+srv://sierracataloguebusiness_db_user:7FFGRqpbjDqx5euV@cluster0.8nbcvye.mongodb.net/?appName=Cluster0";

console.log("Attempting to connect to MongoDB...");
console.log(`URI: ${uri.replace(/:([^:@]+)@/, ':****@')}`); // Log masked URI

mongoose.connect(uri)
    .then(() => {
        console.log("SUCCESS: Connected to MongoDB!");
        process.exit(0);
    })
    .catch(err => {
        console.error("ERROR: Could not connect to MongoDB");
        console.error(err);
        process.exit(1);
    });
