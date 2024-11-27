import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGODB_URI;

const dateBase = mongoose.connect('')
    .then(() => console.log("database working"))
    .catch((error) => console.log(error))
export default dateBase;