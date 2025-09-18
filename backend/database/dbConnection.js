import mongoose from "mongoose";

export const connection = () => {
    mongoose.connect(process.env.MONGODB_URL , {
        dbName: "MERN_AUTHENTICATE",
    })
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log(`Error occured while connecting to database: ${err}`);
    });
};