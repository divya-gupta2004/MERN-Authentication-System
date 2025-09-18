import cron from "node-cron";
import {User} from "../modal/userModel.js"

// to delete users after 30 mins (after 3 attempts of registration), whose account is not verified
export const removeUnverifiedAccounts = () => {
    cron.schedule("*/30 * * * *", async() => {                 // '*/30' means after 30 mins
        // console.log("Automation Running");
        const thirtyMinutesAgo = new (Date.now() - 30 * 60 * 1000);
        const usersToDelete = await User.deleteMany({
            accountVerified: false,
            createdAt: { $lt: thirtyMinutesAgo},
        });
         
    })
}