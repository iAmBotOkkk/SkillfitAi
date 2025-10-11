import mongoose from "mongoose";

const connectDb = async(): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if(!mongoUri){
            throw new Error("Mongo Uri Environment variable is undefined");
        }
        const connection = await mongoose.connect(mongoUri);
        console.log("MongoDb connected" , connection)  
    } catch (error : any) {
        console.log("Error connecting to Mongodb" , error.message);
        process.exit(1)

    }
}

export default connectDb;