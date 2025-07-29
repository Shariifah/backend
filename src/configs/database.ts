import mongoose from "mongoose";
import config from "./config";

// dbLog();

const connectDB = async () => {
    try {
        switch (config.dbms) {
            case "MongoDB":
                await mongoose.connect(config.dbUri);
                console.log(`✅ MongoDB connecté : ${config.dbUri}`);
                break;

            default:
                throw new Error(`❌ ${config.dbms} : Base de données non reconnue`);
        }
    } catch (error) {
        console.error(`❌ Erreur de connexion ${config.dbms}`, error);
        process.exit(1);
    }
};

function dbLog(): void {
    console.log(mongoose.connection.readyState); // logs 0
    mongoose.connection.on('connecting', () => {
        console.log('connecting');
        console.log(mongoose.connection.readyState); // logs 2
    });
    mongoose.connection.on('connected', () => {
        console.log('connected');
        console.log(mongoose.connection.readyState); // logs 1
    });
    mongoose.connection.on('disconnecting', () => {
        console.log('disconnecting');
        console.log(mongoose.connection.readyState); // logs 3
    });
    mongoose.connection.on('disconnected', () => {
        console.log('disconnected');
        console.log(mongoose.connection.readyState); // logs 0
    });
} 

export {
    connectDB
};
