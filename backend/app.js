import express from "express";
import {config} from "dotenv";

config({path: "./config.env"});

import cookieParser from "cookie-parser";
import cors from "cors";
import {connection} from "./database/dbConnection.js"
import { errorMiddleware } from "./middleware/error.js";
import userRouter from './routes/userRouter.js';
import {removeUnverifiedAccounts} from "./automation/removeUnverifiedAccounts.js"

export const app = express();

// console.log("Loaded env: TWILIO_SID:", Boolean(process.env.TWILIO_SID));
// console.log("Loaded env: TWILIO_AUTH_TOKEN:", Boolean(process.env.TWILIO_AUTH_TOKEN));

// when we have to use any middleware, we use 'app.use'
app.use(
    cors({
    // origin: ["URL", "URl2", "URL3"]           // connecting many frontend in one backend
    // origin: process.env.FRONTEND_URL,
    origin: ["http://localhost:5173", "https://mern-authentication-frontend-beta.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());               //used for data parsing
app.use(express.urlencoded({extended: true}));              //this ensures that the data sent to the backend is what type of data

app.use('/api/v1/user', userRouter);

removeUnverifiedAccounts(); 

connection();

app.use(errorMiddleware)