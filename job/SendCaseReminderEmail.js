const models = require('../models');
const cron = require("node-cron");
cron.schedule("*/2 * * * *", async function() {
    
    console.log("---------------------");
    console.log("Running Cron Job");

    // NOW YOU HAVE A COLLECTION OF USERS EMAIL, SEND EMAIL TO EACH AND EVERY ONE OF THEM  
    // I will leave you to figure that out, sending email to multiple users
    // I have hard coded information here but you should be getting it from config or the real model
    console.log(users);
        
    // SEND EMAIL - // ensure this is based on the real case number ie. use ${user.email}

});