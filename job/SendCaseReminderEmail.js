const cron = require("node-cron");
let nodemailer = require("nodemailer");
var models = require('../models');
const { Op } = require('sequelize');
const {sendMail} = require('../helpers/sendMail')

async function automateCaseEmails() {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
      
     let emails = []
    // where: {date_due: {[Op.lte]: new Date()}},
    let escalated = await models.Casemanager.findAll({
        where: {
            status: 'New',
            createdAt: {[Op.lte]: yesterday}
        }
    });
     if(escalated.length !== 0){
        // LOOP OVER ALL USER
        for(let i=0;i<escalated.length;i++) {
            // get emails of users
            await models.Casemanager.update({status: 'Escalated'},{
                where: {id: escalated[i].get('id')}
            });
            let user = await models.User.findByPk(escalated[i].assigned_to);
            emails.push({email: user.email, subject: 'Awaiting Response :)', text: `A case with case number: ${escalated.id} is awaiting your response`})
        }
     }
     let twodays = new Date();
    twodays.setDate(twodays.getDate() - 2);
    // where: {date_due: {[Op.lte]: new Date()}},
    let sla_violation = await models.Casemanager.findAll({
        where: {
            [Op.not]: [{
                status: 'Closed'
            }],
            // status: 'New',
            createdAt: {[Op.lte]: twodays}
        }
    });
    
     if(sla_violation.length !== 0){
        // LOOP OVER ALL USER
        for(let i=0;i<sla_violation.length;i++) {
            // get emails of users
            await models.Casemanager.update({SlA_violation: 'Yes'},{
                where: {id: sla_violation[i].get('id')}
            });
            let user = await models.User.findByPk(sla_violation[i].assigned_to);
            emails.push({email: user.email, subject: 'Awaiting Response :)', text: `A case with case number: ${sla_violation[i].id} is still processing and awaiting your response`})
        }
     }
     if(emails.length !== 0){
        // LOOP OVER ALL USER
        for(let i=0;i<emails.length;i++) {
     cron.schedule("* 6 * * *", async function() {
         
      console.log("---------------------");
      console.log("Running Cron Job");
      console.log(emails[i].text)
      sendMail(emails[i].email, emails[i].subject, emails[i].text);
    });
}
      
      }
        

}

module.exports = automateCaseEmails;