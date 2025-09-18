import {app} from './app.js'
import {config} from "dotenv";

config({ path: "./config.env" });  

// console.log("TWILIO_SID loaded:", Boolean(process.env.TWILIO_SID));
// console.log("TWILIO_AUTH_TOKEN loaded:", Boolean(process.env.TWILIO_AUTH_TOKEN));

app.listen(process.env.PORT, () => {
    console.log(`Server listening on ${process.env.PORT}`);
});