import dotenv from 'dotenv';
dotenv.config();

export default {
    KEY: process.env.KEY,
    MONGO_CONNECTION: process.env.MONGO_CONNECTION
}