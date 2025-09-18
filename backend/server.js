import {app} from './app.js'
import {config} from "dotenv";

config({ path: "./config.env" });  

// console.log("TWILIO_SID loaded:", Boolean(process.env.TWILIO_SID));
// console.log("TWILIO_AUTH_TOKEN loaded:", Boolean(process.env.TWILIO_AUTH_TOKEN));

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// app.listen(process.env.PORT, () => {
//     console.log(`Server listening on ${process.env.PORT}`);
// });