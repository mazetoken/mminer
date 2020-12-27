import * as dotenv from "dotenv";
dotenv.config();

import { generateV1 } from "./generateV1";

const run = async () => {
    while (true) {
        try {
            await generateV1();
        } catch (error) {
            console.log(error);
            if (error.message.includes("There are no non-SLP inputs available to pay for gas")) {
                process.exit();
            }
        }
    }
};

console.log("Mminer1.0.2 started.");
run();
