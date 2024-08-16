//done

import mongoose from "mongoose";

type ConnectionObject = {    // ConnectionObject is an object
    isConnected?: number;    // isConnected is optional
};

const connection: ConnectionObject = {}; //it is empty object

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Using existing connection");
        return;
    }

    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URL}` || "", {})

        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Error connecting to database", error);
        process.exit(1);
    }

}
export default dbConnect;
